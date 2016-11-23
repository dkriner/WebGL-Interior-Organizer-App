/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// renderable representing the scale (vertical) and rotation (horizontal) handle bars 
function SceneHandle(shader, scene) {
    SceneNode.call(this, shader, scene.getName() + " Handle", false);
    var obj, xf, mForm = this.getXform();
    var barWidth = 0.1, barLen = 1;
    
    this.mScene = scene;
    this.update();

    // The vertical handle bar
    this.yBar = obj = new SquareRenderable(shader);  
    xf = obj.getXform();
    obj.setColor([0, 0, 0, 1]); // black
    xf.setSize(barWidth, barLen);
    xf.setPosition(0, barLen/2);
    this.addToSet(obj);

    // The horizontal handle bar
    this.xBar = obj = new SquareRenderable(shader);  
    xf = obj.getXform();
    obj.setColor([0, 0, 0, 1]); // black
    xf.setSize(barLen, barWidth);
    xf.setPosition(barLen/2, 0);
    this.addToSet(obj);

    // The vertical handle bar tip
    this.yBarTip = obj = new CircleRenderable(shader);  
    xf = obj.getXform();
    obj.setColor([1, 0, 0, 1]); // red
    xf.setSize(0.2, 0.2);
    xf.setPosition(0, barLen);
    this.addToSet(obj);

    // The horizontal handle bar tip
    this.xBarTip = obj = new CircleRenderable(shader);  
    xf = obj.getXform();
    obj.setColor([1, 0, 0, 1]); // red
    xf.setSize(0.2, 0.2);
    xf.setPosition(barLen, 0);
    this.addToSet(obj);
    
    // the trans handle tip
    this.transTip = obj = new SquareRenderable(shader);
    xf = obj.getXform();
    obj.setColor([1,0,0,1]);
    xf.setSize(0.3,0.3);
    xf.setPosition(0,0);
    this.addToSet(obj);
}
gEngine.Core.inheritPrototype(SceneHandle, SceneNode);

// syncrhonize with the target sceneNode
SceneHandle.prototype.update = function (scene) { 
    // update to work on multi-level scenes  
    var node = this.mScene;
    //var node = scene;
    var m = node.getXform().getXform();

    while (node.mParent) {
        var parentMat = node.mParent.getXform().getXform();
        mat4.multiply(m, parentMat, m);
        node = node.mParent;
    } 

    var pivotPos = this.mScene.getXform().getPivot();
    var posWC = vec2.fromValues(0, 0);
    vec2.transformMat4(posWC, pivotPos, m);
    var x = posWC[0], y = posWC[1];

    var sceneForm = this.mScene.getXform();
    // var x = sceneForm.getXPos() + sceneForm.getPivotXPos();
    // var y = sceneForm.getYPos() + sceneForm.getPivotYPos();
    this.getXform().setPosition(x,y);
    this.getXform().setRotationInRad(sceneForm.getRotationInRad());
};

SceneHandle.prototype.setScene = function (scene) {
    this.setName(scene.getName + " Handle");
    this.mScene = scene;
    this.update();
};

SceneHandle.prototype.mouseInTransHandle = function (wcX,wcY,dist) {
    var tipPos = this.transTip.getXform().getPosition();
    var posWC = vec2.fromValues(0, 0);
    vec2.transformMat4(posWC, tipPos, this.getXform().getXform());

    return this._mouseWithin(posWC[0], posWC[1], wcX, wcY, dist);
};

SceneHandle.prototype.mouseInScaleHandle = function (wcX,wcY,dist) {
    var tipPos = this.yBarTip.getXform().getPosition();
    var posWC = vec2.fromValues(0, 0);
    vec2.transformMat4(posWC, tipPos, this.getXform().getXform());

    return this._mouseWithin(posWC[0], posWC[1], wcX, wcY, dist);
};

SceneHandle.prototype.mouseInRotHandle = function (wcX,wcY,dist) {
    var tipPos = this.xBarTip.getXform().getPosition();
    var posWC = vec2.fromValues(0, 0);
    vec2.transformMat4(posWC, tipPos, this.getXform().getXform());

    console.log('rotHandle', tipPos, posWC);

    return this._mouseWithin(posWC[0], posWC[1], wcX, wcY, dist);
};

SceneHandle.prototype._mouseWithin = function (targetX,targetY,wcX,wcY,dist) {
    console.log([targetX, targetY], [wcX, wcY]);

    var calcDist = Math.sqrt(Math.pow(wcX - targetX, 2) + Math.pow(wcY - targetY, 2));
    return calcDist <= dist;
};


SceneHandle.prototype.draw = function (aCamera, parentMat) {
    this.update();
    SceneNode.prototype.draw.call(this, aCamera, parentMat);
};


