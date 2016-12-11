/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


// TODO: remove shader param ( no point )
function SceneNode(shader, name, drawPivot, xPos, yPos) {
    if (xPos === undefined) xPos = 0;
    if (yPos === undefined) yPos = 0;
    
    this.mName = name;
    this.mSet = [];
    this.mChildren = [];
    this.mXform = new PivotedTransform(xPos, yPos);
    this.mParent = null;

    // this is for debugging only: for drawing the pivot position
    this.mPivotPos = null;
    if ((drawPivot !== undefined) && (drawPivot === true)) {
        this.mPivotPos = new SquareRenderable(shader);
        this.mPivotPos.setColor([1, 0, 0, 1]); // default color
        var xf = this.mPivotPos.getXform();
        xf.setSize(0.2, 0.2); // always this size
    }
}
SceneNode.prototype.setName = function (n) { this.mName = n; };
SceneNode.prototype.getName = function () { return this.mName; };

SceneNode.prototype.getXform = function () { return this.mXform; };

SceneNode.prototype.size = function () { return this.mSet.length; };

SceneNode.prototype.getRenderableAt = function (index) {
    return this.mSet[index];
};

SceneNode.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
    obj.mParent = this;
};
SceneNode.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1) {
        this.mSet[index].mParent = null;
        this.mSet.splice(index, 1);
    }
};
SceneNode.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

// support children opeations
SceneNode.prototype.addAsChild = function (node) {
    node.mParent = this;
    this.mChildren.push(node);
};
SceneNode.prototype.removeChild= function (node) {
    var index = this.mChildren.indexOf(node);
    if (index > -1) {
        this.mChildren[index].mParent = null;
        this.mChildren.splice(index, 1);
    }
};
SceneNode.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};

// converts world coords to scene's local coord system
SceneNode.prototype.localToWC = function(coords) {
    var m = this._getXFormStack();
    return vec2.transformMat4(vec2.create(), coords, m);
};

// converts local scene coords to world coord system
SceneNode.prototype.wcToLocal = function(coords) {
    var m = mat4.invert(mat4.create(), this._getXFormStack());
    return vec2.transformMat4(vec2.create(), coords, m);
};

// get concatenation of this and all parent scenes xforms
SceneNode.prototype._getXFormStack = function() {
    var currNode = this;
    var m = currNode.getXform().getXform();
    while (currNode.mParent) {
        var parentMat = currNode.mParent.getXform().getXform();
        mat4.multiply(m, parentMat, m);
        currNode = currNode.mParent;
    } 
    return m;
};

// get concatenation of this and all parent scenes rotation
SceneNode.prototype.getWCRotation = function() {
    var rot = 0, currNode = this;
    do rot += currNode.getXform().getRotationInRad();
    while (currNode = currNode.mParent);
    while (rot > 2*Math.PI) rot -= 2*Math.PI;
    return rot;
};

SceneNode.prototype.draw = function (aCamera, parentMat) {
    var i;
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(xfMat, parentMat, xfMat);
    
    // Draw our own!
    for (i = 0; i < this.mSet.length; i++) {
        
        this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // now draw the children
    for (i = 0; i < this.mChildren.length; i++) {

        
        this.mChildren[i].draw(aCamera, xfMat); // pass to each renderable
        
        
        
        
    }
    
    // for debugging, let's draw the pivot position
    if (this.mPivotPos !== null && aCamera.mName === "Large") {
        var pxf = this.getXform();
        var t = pxf.getPosition();
        var p = pxf.getPivot();
        var xf = this.mPivotPos.getXform();
        xf.setPosition(p[0] + t[0], p[1] + t[1]);
        this.mPivotPos.draw(aCamera, parentMat);
    }
};