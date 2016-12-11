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
        "src/GLSLShaders/SimpleFS.glsl");     // Path to the simple FragmentShader
        
    // ********************************************
    //         control point for the mouse
    // ********************************************
    this.mXfSq = new SquareRenderable(this.mConstColorShader);
    this.mXfSq.setColor([0.3, 0., 0.3, 1]);
    this.mXfSq.getXform().setSize(0.2, 0.2);

    // ********************************************
    //                  the room
    // ********************************************
    var centerOfRoom = [0, 3];
    this.mRoomParent = new SceneNode(this.mConstColorShader, "Root", true, 
                                    centerOfRoom[0], centerOfRoom[1]);
                                    
    this.mCeilingParent = new SceneNode(this.mConstColorShader, "Ceiling", false,
                                    centerOfRoom[0], centerOfRoom[1]);                                
    
    
    var xfRoomPXf = this.mRoomParent.getXform();
    xfRoomPXf.setPivot(centerOfRoom[0], centerOfRoom[1]);
    
    // ********************************************
    //                   floor
    // ********************************************
    this.mFloorPattern = new SquareRenderable(this.mConstColorShader);
    // this.mFloorPattern.setColor([0.3, 0.3, 0.3, 1]);
    this.mFloorPattern.setTexture(new Texture('assets/sung.jpg'));

    var xf = this.mFloorPattern.getXform();
    xf.setSize(14.75, 11);
    xf.setPosition(centerOfRoom[0], centerOfRoom[1]);
    
    // ********************************************
    //                  the beds
    // ********************************************


    // ********************************************
    //                  the textures
    // ********************************************
    // TODO: move this to somewhere more global
    this.textures = {
        "Bed": new Texture('assets/bed.png'),
        "Lamp": new Texture('assets/lamp.png'),
        "Plant": new Texture('assets/plant.png'),
        "Chair": new Texture('assets/chair.png'),
        "Couch": new Texture('assets/couch.png'),
        "Ceiling Fan": new Texture('assets/ceiling_fan.png'),
        "Rug": new Texture('assets/rug.png'),
        "Table": new Texture('assets/table.png')
    };
}

//World.prototype.toggleHeadSpin = function () {
//    this.mHeadShouldSpin = !this.mHeadShouldSpin; };

//World.prototype.toggleChildUpdate = function () {
//    this.mChildShouldUpdate = !this.mChildShouldUpdate; };

//World.prototype.toggleArmRotate = function () {
//    this.mArmShouldRotate = !this.mArmShouldRotate; };

World.prototype.draw = function (camera, drawCeiling) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();
    
    this.mFloorPattern.draw(camera);
    this.mRoomParent.draw(camera);
    if (drawCeiling) this.mCeilingParent.draw(camera);
};

World.prototype.addFurniture = function(item) {
    // TODO: add to floor or ceiling based on item
    this.mRoomParent.addAsChild(item);
};

// TODO: remove this function
World.prototype.addCeilingItem = function(item) {
    this.mCeilingParent.addAsChild(item);
};

World.prototype.removeFurniture = function(item) {
    this.mRoomParent.removeChild(item);
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

// TODO: Update getters to return based on array (will allow for dynamic creation)
World.prototype.leftChildXform = function () {
    return this.mBedParent.getXform();
};

World.prototype.leftChildScene = function () {
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