/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function World() {
    this.mShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");     // Path to the simple FragmentShader
        
    // ********************************************
    //         control point for the mouse
    // ********************************************
    this.mXfSq = new SquareRenderable(this.mShader);
    this.mXfSq.setColor([0.3, 0., 0.3, 1]);
    this.mXfSq.getXform().setSize(0.2, 0.2);

    // ********************************************
    //               the room / house
    // ********************************************
    // TODO: expand to more than one room
    this.mRoom = new Room(this.mShader, "Living Room", 0, 3, 14.75, 11);  
    this.mHouse = new SceneNode(this.mShader, "House", false, 0,0);
    this.mHouse.addAsChild(this.mRoom);
    
    // var xfRoomPXf = this.mFloorParent.getXform();
    // xfRoomPXf.setPivot(centerOfRoom[0], centerOfRoom[1]);

    // ********************************************
    //                   textures
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

World.prototype.draw = function (camera, drawCeiling) {
    camera.setupViewProjection();
    
    // TODO: draw whole house and pass drawCeiling down
    this.mRoom.draw(camera, drawCeiling);
};

World.prototype.update = function () {

};