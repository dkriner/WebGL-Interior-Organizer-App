/*
 * File: Bed.js 
 * A bed object.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Bed(shader, name, xPos, yPos, baseColor, initBedSize) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor
    
    var xf = this.getXform();
    xf.setPosition(xPos, yPos);
    //xf.setPivot(xPivot, yPivot);
    var scale = 1;
    
    // always initialize sizes and positions to Bed1
    var bedSize = initBedSize;
    var leftSquarePillowSize = [1.75, 1.75];
    var rightSquarePillowSize = [1.75, 1.75];
    var leftCircleHeadSize = [0.75, 0.75];
    var rightCircleHeadSize = [0.75, 0.75];

    var bedPos = [0, 0];
    var leftSquarePillowPos = [0 - 1.25, 2.5];
    var rightSquarePillowPos = [1.25, 2.5];
    var leftCircleHeadPos = [0 - 1.25, 2.25];
    var rightCircleHeadPos = [0 + 1.25, 2.25];

    this.bedColor = baseColor;

    // set other bed sizes and positions
    // scale to 1/2
    if (name === "Bed Gen2Slider")
    {
//        bedSize[0] *= ;
//        bedSize[1] *= ;
//        leftSquarePillowSize[0] *= ;
//        leftSquarePillowSize[1] *= ;
//        rightSquarePillowSize[0] *= ;
//        rightSquarePillowSize[1] *= ;
//        leftCircleHeadSize[0] = ;
//        leftCircleHeadSize[1] = ;
//        rightCircleHeadSize[0] = ;
//        rightCircleHeadSize[1] = ;
//
//
//
//        bedPos = ;
//        leftSquarePillowPos = [xPivot - 1.25, 2.5 + yPivot];
//        rightSquarePillowPos = [xPivot + 1.25, 2.5 + yPivot];
//        leftCircleHeadPos = [xPivot - 1.25, 2.25 + yPivot];
//        rightCircleHeadPos = [xPivot + 1.25, 2.25 + yPivot];
    }
    // scale to 1/3
    else if (name === "Bed Gen3Baby")
    {
        scale = 1/3;
    }

    bedSize[0] *= scale;
    bedSize[1] *= scale;
    leftSquarePillowSize[0] *= scale;
    leftSquarePillowSize[1] *= scale;
    rightSquarePillowSize[0] *= scale;
    rightSquarePillowSize[1] *= scale;
    leftCircleHeadSize[0] *= scale;
    leftCircleHeadSize[1] *= scale;
    rightCircleHeadSize[0] *= scale;
    rightCircleHeadSize[1] *= scale;

    //bedPos = ;
    leftSquarePillowPos = [0 - 1.25 * scale, 2.5 * scale];
    rightSquarePillowPos = [1.25 * scale, 2.5 * scale];
    leftCircleHeadPos = [0 - 1.25 * scale, 2.25 * scale];
    rightCircleHeadPos = [1.25 * scale, 2.25 * scale];


    // ******************************************
    // BED
    // ******************************************
    var obj = new SquareRenderable(shader); 
    this.addToSet(obj);
    obj.setColor(baseColor);
    xf = obj.getXform();
    xf.setSize(bedSize[0], bedSize[1]);
    xf.setPosition(bedPos[0], bedPos[1]);
 
    // ******************************************
    // LEFT SQUARE PILLOW
    // ******************************************
    obj = new SquareRenderable(shader);     
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(leftSquarePillowSize[0], leftSquarePillowSize[1]);
    xf.setPosition(leftSquarePillowPos[0], leftSquarePillowPos[1]);
    
    // ******************************************
    // RIGHT SQUARE PILLOW
    // ******************************************
    obj = new SquareRenderable(shader);     
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(rightSquarePillowSize[0], rightSquarePillowSize[1]);
    xf.setPosition(rightSquarePillowPos[0], rightSquarePillowPos[1]);

    // ******************************************
    // LEFT CIRCLE PILLOW/HEAD
    // ******************************************
    obj = new CircleRenderable(shader);     
    this.addToSet(obj);
    obj.setColor([1, 1, 1, 1]);
    xf = obj.getXform();
    xf.setSize(leftCircleHeadSize[0], leftCircleHeadSize[1]);
    xf.setPosition(leftCircleHeadPos[0], leftCircleHeadPos[1]);

    // ******************************************
    // RIGHT CIRCLE PILLOW/HEAD
    // ******************************************
    obj = new CircleRenderable(shader);     
    this.addToSet(obj);
    obj.setColor([1, 1, 1, 1]);
    xf = obj.getXform();
    xf.setSize(rightCircleHeadSize[0], rightCircleHeadSize[1]);
    xf.setPosition(rightCircleHeadPos[0], rightCircleHeadPos[1]);

    var xf = this.getXform();
    xf.setPivot(bedPos[0], bedPos[1]);

    this.mPulseRate = 0.005;        // THE RATE OF SCALING IN AND OUT
    this.mRotateRate = -2;          // THE RATE OF ROATION
}
gEngine.Core.inheritPrototype(Bed, SceneNode);

Bed.prototype.update = function () {
//    // index-1 is the red-top
//    var xf = this.getRenderableAt(1).getXform();
//    xf.incRotationByDegree(this.mRotateRate);
//    
//    // index-4 is the blue circle
//    xf = this.getRenderableAt(4).getXform();
//    xf.incSizeBy(this.mPulseRate);
//    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
//        this.mPulseRate = -this.mPulseRate;
};

