/*
 * File: Bed.js 
 * A bed object.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Room(shader, name, xPos, yPos, width, height) {
    SceneNode.call(this, shader, name, true);
    
    var xf = this.getXform();
    xf.setPosition(xPos, yPos);
    //xf.setPivot(xPivot, yPivot);

    // floor
    this.floor = new SceneNode(shader, "Floor", false, 0,0);
    this.addAsChild(this.floor);

    // ceiling
    this.ceiling = new SceneNode(shader, "Ceiling", false, 0,0);
    this.addAsChild(this.ceiling);

    // wall
    this.wall = new SquareRenderable(shader);
    this.wall.setColor([132/255, 85/255, 14/255, 1]); // brown
    this.addToSet(this.wall);

    // floor pattern
    this.floorPattern = new SquareRenderable(shader);
    // this.floorPattern.setColor([0.3, 0.3, 0.3, 1]);
    this.setFloorPattern(new Texture('assets/floor2.jpg'));
    this.setFloorPatternScale(3,3);
    this.setSize(width, height);
    this.addToSet(this.floorPattern);
}
gEngine.Core.inheritPrototype(Room, SceneNode);

Room.prototype.addFurniture = function(item) {
    // TODO: expand logic to any ceiling item via flag
    if (item.getName() == 'Ceiling Fan 1')
        this.ceiling.addAsChild(item);
    else this.floor.addAsChild(item);
};

Room.prototype.removeFurniture = function(item) {
    this.floor.removeChild(item);
    this.ceiling.removeChild(item);
};

Room.prototype.setFloorPattern = function (texture) {
    this.floorPattern.setTexture(texture);
};

Room.prototype.getFloorPatternScale = function() {
    var txf = this.floorPattern.getTexXform();
    return txf.getWidth();
};

Room.prototype.setFloorPatternScale = function (scale) {
    var txf = this.floorPattern.getTexXform();
    var ratio = this.getSize()[1] / this.getSize()[0];
    txf.setSize(scale , scale * ratio);
};

Room.prototype.getSize = function() {
    var xf = this.floorPattern.getXform();
    return [xf.getWidth(), xf.getHeight()];
};

Room.prototype.setSize = function(width, height) {
    this.floorPattern.getXform().setSize(width, height);
    this.setFloorPatternScale(this.getFloorPatternScale());
    var wallWidth = 0.3;
    this.wall.getXform().setSize(width + wallWidth*2, height + wallWidth*2);
    // TODO: move furniture within bounds
};

Room.prototype.draw = function (camera, drawCeiling) {
    this.wall.draw(camera, this.getXform().getXform());
    this.floorPattern.draw(camera, this.getXform().getXform());
    this.floor.draw(camera, this.getXform().getXform());
    if (drawCeiling) this.ceiling.draw(camera, this.getXform().getXform());
};

