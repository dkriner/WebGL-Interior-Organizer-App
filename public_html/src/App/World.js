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
    
    this.vmShouldDrawControl = false;
    

    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
        
    this.mHeadSq = new SquareRenderable(this.mConstColorShader);
    this.mHeadSq.setColor([0.2, 1.0, 0.2, 1]);
    this.mHeadSq.getXform().setSize(0.25, 0.25);
    this.mBlueSq = new SquareRenderable(this.mConstColorShader);
    this.mBlueSq.setColor([0.5, 0.5, 1.0, 1]);
    this.mBlueSq.getXform().setSize(0.25, 0.25);
    this.mRedSq =  new SquareRenderable(this.mConstColorShader);
    this.mRedSq.setColor([1.0, 0.5, 0.5, 1]);
    this.mRedSq.getXform().setSize(0.25, 0.25);
    this.mXfSq =  new SquareRenderable(this.mConstColorShader);
    this.mXfSq.setColor([0.4, 0., 0.4, 1]);
    this.mXfSq.getXform().setSize(0.2, 0.2);

    this.mParent = new SceneNode(this.mConstColorShader, "Root", true);
    this.mLeftChild = new ArmSegment(this.mConstColorShader, "LeftGen 1",
                            -2, 0);
    this.mParent.addAsChild(this.mLeftChild);
    this.mTopChild = new ArmSegment(this.mConstColorShader, "LeftGen 2",
                            -2, 2);
    this.mLeftChild.addAsChild(this.mTopChild);

    this.mRightChild = new ArmSegment(this.mConstColorShader, "RightGen 1",
                            2, 0);
    this.mParent.addAsChild(this.mRightChild);  // <-- WHAT ARE WE DOING?!!


    // shapes in the parent
    var obj = new SquareRenderable(this.mConstColorShader);  // the base
    this.mParent.addToSet(obj);
    obj.setColor([0.3, 0.3, 0.9, 1]);
    var xf = obj.getXform();
    xf.setSize(4, 1.5);
    
    //obj = new SquareRenderable(this.mConstColorShader); // The head
    obj = new CircleRenderable(this.mConstColorShader); // The head
    this.mParent.addToSet(obj);
    obj.setColor([0.3,0.3,0.3,1]);
    xf = obj.getXform();
    xf.setSize(1.3, 1.3);
    
    // ********************************************
    //                  the beds
    // ********************************************
    this.mBedParent = new SceneNode(this.mConstColorShader, "Root", true);
    this.mArrayOfBeds = [];
    var initBedSize = [5, 7];
    
    var bedColor = [[0.8, 0, 0, 1], 
                    [0, 1, 0, 1], 
                    [0, 0, 1, 1]];
    
    var bedNames = ["Bed1", "Bed2", "Bed3"];
    var firstBedPos = [-4, 4];

    var bed = new Bed(this.mConstColorShader, bedNames[0], 
                        firstBedPos[0], firstBedPos[1], bedColor[0], initBedSize);
    this.mArrayOfBeds.push(bed);
    this.mBedParent.addAsChild(bed);

    for (var i = 1; i < bedNames.length; i++)
    {
        var bed = new Bed(this.mConstColorShader, bedNames[i], 
                            firstBedPos[0] + i + 4, firstBedPos[1], bedColor[i], initBedSize);
        this.mArrayOfBeds.push(bed);
        this.mBedParent.addAsChild(bed);
        //this.mBedParent.addToSet(bed);
    }
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

    this.mParent.draw(camera);
//    this.mArrayOfBeds.forEach(function(element) 
//    {
//        element.draw(camera);
//    });
    this.mBedParent.draw(camera);
    
    // display "Bed1" on top of others
//    for (var i = this.mArrayOfBeds.length - 1; i >= 0; i--)
//    {
//        alert(i);
//        this.mArrayOfBeds[i].draw(camera);
//    }
    
    if (this.vmShouldDrawControl) {
        this.mHeadSq.draw(camera);
        this.mBlueSq.draw(camera);
        this.mRedSq.draw(camera);
        this.mXfSq.draw(camera);
    }
};

World.prototype.update = function () {
    if (this.mChildShouldUpdate) {
        this.mLeftChild.update();
        this.mRightChild.update();
        this.mTopChild.update();
    }
    
    // 1. rotate the head (middle square on body)
    if (this.mHeadShouldSpin) {
        var xf = this.mParent.getRenderableAt(1).getXform(); // this is the middle square
        xf.incRotationByDegree(2);
        var d = xf.getRotationInDegree();
    }
    
    // 2. extend the lower-left hand
    if (this.mArmShouldRotate) {
        xf = this.leftChildXform();
        xf.incSizeBy(this.mSizeChange);
        if ((xf.getWidth() > 1.2) || (xf.getWidth() < 0.8))
            this.mSizeChange = -this.mSizeChange;
    
        // 3. slowly rotat the top arm
        xf = this.topChildXform();
        xf.incRotationByDegree(-1);
    }
};



World.prototype.leftChildXform = function () {
    return this.mLeftChild.getXform();
};

World.prototype.rightChildXform = function () {
    return this.mRightChild.getXform();
};


World.prototype.topChildXform = function () {
    return this.mTopChild.getXform();
};


World.prototype.parentXform = function () {
    return this.mBedParent.getXform();
    //return this.mParent.getXform();
};