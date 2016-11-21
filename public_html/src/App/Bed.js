/*
 * File: Bed.js 
 * A bed object.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Bed(shader, name, xPivot, yPivot) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
    
    // now create the children shapes
    var obj = new SquareRenderable(shader);  // The yellow 3 x 7 base of the bed
    this.addToSet(obj);
    obj.setColor([1, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(3, 7);
    xf.setPosition(xPivot, 1 + yPivot);
 
    obj = new SquareRenderable(shader);  // The left square pillow
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.75, 0,75); // so that we can see the connecting point
    xf.setPosition(xPivot, 1.75 + yPivot);
    
    obj = new SquareRenderable(shader); // The right square pillow
    this.addToSet(obj);
    //obj.setColor([0, 1, 0, 1]);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.75, 0.75); // so that we can see the connecting point
    xf.setPosition(xPivot+0.375, 1.75 + yPivot);
    
    obj = new CircleRenderable(shader); // The left circle head/pillow
    this.addToSet(obj);
    obj.setColor([0, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, 0.25); // so that we can see the connecting point
    xf.setPosition(xPivot, 1.75 + yPivot);
    
    obj = new CircleRenderable(shader); // The right circle head/pillow
    this.addToSet(obj);
    obj.setColor([0, 0, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, 0.25); // so that we can see the connecting point
    xf.setPosition(xPivot + 0.375, 1.75 + yPivot);
    
    this.mPulseRate = 0.005;        // THE RATE OF SCALING IN AND OUT
    this.mRotateRate = -2;          // THE RATE OF ROATION
}
gEngine.Core.inheritPrototype(Bed, SceneNode);

Bed.prototype.update = function () {
    // index-1 is the red-top
    var xf = this.getRenderableAt(1).getXform();
    xf.incRotationByDegree(this.mRotateRate);
    
    // index-4 is the blue circle
    xf = this.getRenderableAt(4).getXform();
    xf.incSizeBy(this.mPulseRate);
    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
        this.mPulseRate = -this.mPulseRate;
};