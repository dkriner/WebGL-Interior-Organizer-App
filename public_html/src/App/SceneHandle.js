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
    SceneNode.call(this, shader, scene.getName() + " Handle", true);
    var obj, xf, mForm = this.getXform();
    var barWidth = 0.1, barLen = 1.5;

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
}
gEngine.Core.inheritPrototype(SceneHandle, SceneNode);

// syncrhonize with the target sceneNode
SceneHandle.prototype.update = function (scene) {    
    var sceneForm = this.mScene.getXform();
    this.getXform().setPosition(sceneForm.getPivotXPos(), sceneForm.getPivotYPos());
    this.getXform().setRotationInRad(sceneForm.getRotationInRad());
};

SceneHandle.prototype.setScene = function (scene) {
    this.mScene = scene;
    this.update();
};

SceneHandle.prototype.mouseInTransHandle = function (wcX,wcY) {
    // Do Handle stuff
};

SceneHandle.prototype.mouseInScaleHandle = function (wcX,wcY) {
    // Do Handle stuff
};

SceneHandle.prototype.mouseInRotHandle = function (wcX,wcY) {
    // Do Handle stuff
};

SceneHandle.prototype._mouseWithin = function (targetX,targetY,wcX,wcY,dist) {
    // Do Handle stuff
};

SceneHandle.prototype.draw = function (aCamera, parentMat) {
    this.update();
    SceneNode.prototype.draw.call(this, aCamera, parentMat);
};