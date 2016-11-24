/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function World() {
    this.mSizeChange = 0.01;
    this.mChildShouldUpdate = false;
    this.mArmShouldRotate = false;
    this.mHeadShouldSpin = false;
    this.mSelectedObject = "Parent Bed";
    
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
        
    // CONTROL POINT FOR MOUSE
    this.mXfSq =  new SquareRenderable(this.mConstColorShader);
    this.mXfSq.setColor([0.3, 0., 0.3, 1]);
    this.mXfSq.getXform().setSize(0.2, 0.2);

    // ********************************************
    //                  the room
    // ********************************************
    this.mArrayOfSceneNodes = [];
    
    var firstBedPos = [-4, 4];
    var centerOfRoom = [0, 3];
    this.mRoomParent = new SceneNode(this.mConstColorShader, "Root", true, 
                                    centerOfRoom[0], centerOfRoom[1]);
    this.mArrayOfSceneNodes.push(this.mRoomParent);
    
    var xfRoomPXf = this.mRoomParent.getXform();
    xfRoomPXf.setPivot(centerOfRoom[0], centerOfRoom[1]);
    
    var obj = new SquareRenderable(this.mConstColorShader);
    obj.setColor([0.3, 0.3, 0.3, 1]);
    
    var xf = obj.getXform();
    xf.setSize(14.75, 11);
    xf.setPosition(centerOfRoom[0], centerOfRoom[1]);
    this.mRoomParent.addToSet(obj);
    
    // ********************************************
    //                  the beds
    // ********************************************
    this.mArrayOfBeds = [];
    var initBedSize = [5, 7];
    
    var bedColor = [[0.8, 0, 0, 1], 
                    [0, 1, 0, 1], 
                    [0, 0, 1, 1]];
    
    var bedNames = ["Bed Gen2Main", "Bed Gen2Slider", "Bed Gen3Baby"];

    // Bed Gen2Main   ********************************************
    this.mBedParent = new SceneNode(this.mConstColorShader, "Root", true, 
                                    firstBedPos[0], firstBedPos[1]);
    this.mArrayOfSceneNodes.push(this.mBedParent);
    this.mRoomParent.addAsChild(this.mBedParent);
    
    this.mBed1 = new Bed(this.mConstColorShader, bedNames[0], 
                        firstBedPos[0], firstBedPos[1], bedColor[0], initBedSize);
    this.mArrayOfBeds.push(this.mBed1);
    this.mBedParent.addAsChild(this.mBed1);

    // Bed Gen2Slider   ********************************************
    this.mBed2 = new Bed(this.mConstColorShader, bedNames[1], 
                        firstBedPos[0] + 5, firstBedPos[1], bedColor[1], initBedSize);
    this.mArrayOfBeds.push(this.mBed2);
    this.mRoomParent.addAsChild(this.mBed2);
    
    // Bed Gen3Baby   ********************************************
    this.mBed3 = new Bed(this.mConstColorShader, bedNames[2], 
                        firstBedPos[0], firstBedPos[1] - 1.75, bedColor[2], initBedSize);
    this.mArrayOfBeds.push(this.mBed3);
    this.mBedParent.addAsChild(this.mBed3);
}

World.prototype.toggleHeadSpin = function () {
    this.mHeadShouldSpin = !this.mHeadShouldSpin; };

World.prototype.toggleChildUpdate = function () {
    this.mChildShouldUpdate = !this.mChildShouldUpdate; };

World.prototype.toggleArmRotate = function () {
    this.mArmShouldRotate = !this.mArmShouldRotate; };

World.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();
    
    this.mRoomParent.draw(camera);
    //this.mXfSq.draw(camera);    // DRAW MOUSE CONTROL POINT
};

World.prototype.update = function () {
//    if (this.mChildShouldUpdate) {
//        this.mLeftChild.update();
//        this.mRightChild.update();
//        this.mTopChild.update();
//    }
//    
//    // 1. rotate the head (middle square on body)
//    if (this.mHeadShouldSpin) {
//        var xf = this.mParent.getRenderableAt(1).getXform(); // this is the middle square
//        xf.incRotationByDegree(2);
//        var d = xf.getRotationInDegree();
//    }
//    
//    // 2. extend the lower-left hand
//    if (this.mArmShouldRotate) {
//        xf = this.leftChildXform();
//        xf.incSizeBy(this.mSizeChange);
//        if ((xf.getWidth() > 1.2) || (xf.getWidth() < 0.8))
//            this.mSizeChange = -this.mSizeChange;
//    
//        // 3. slowly rotat the top arm
//        xf = this.topChildXform();
//        xf.incRotationByDegree(-1);
//    }
};

World.prototype.leftChildXform = function () {
//    return this.mBed1.getXform();
    return this.mBedParent.getXform();
};

World.prototype.leftChildScene = function () {
    //return this.mBed1;
    return this.mBedParent;
};

World.prototype.rightChildXform = function () {
    return this.mBed2.getXform();
};

World.prototype.rightChildScene = function () {
    return this.mBed2;
};

World.prototype.topChildXform = function () {
    return this.mBed3.getXform();
};

World.prototype.topChildScene = function () {
    return this.mBed3;
};

World.prototype.parentXform = function () {
    return this.mRoomParent.getXform();
};

World.prototype.parentScene = function () {
    return this.mRoomParent;
};