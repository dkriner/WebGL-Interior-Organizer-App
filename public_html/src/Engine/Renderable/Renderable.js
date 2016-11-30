/*
 * File: Renderable.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
/*jslint node: true, vars: true */
/*global gEngine, Transform, mat4, matrix */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Renderable(shader) {
    this.mShader = shader;         // the shader for shading this object
    this.mXform = new Transform(); // transform that moves this object around
    this.mColor = [1, 1, 1, 0];    // color of pixel
    this.mTexture = null;
    this.mParent = null;
}

Renderable.prototype.update = function () {};

//<editor-fold desc="Public Methods">
//**-----------------------------------------
// Public methods
//**-----------------------------------------
Renderable.prototype.draw = function (camera) {
    if (this.mTexture)
        this.mTexture.activate();
    else Texture.prototype.deactivate();
};

Renderable.prototype.computeXform = function (parentMat) {
    var m = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(m, parentMat, m);
    return m;
};
Renderable.prototype.computeAndLoadModelXform = function (parentMat) {
    var m = this.computeXform(parentMat);
    this.mShader.loadObjectTransform(m);
};

Renderable.prototype.setTexture = function (tex) { this.mTexture = tex; };
Renderable.prototype.getTexture = function () { return this.mTexture; };
Renderable.prototype.getXform = function () { return this.mXform; };
Renderable.prototype.setColor = function (color) { this.mColor = color; };
Renderable.prototype.getColor = function () { return this.mColor; };
Renderable.prototype.getVelocity = function () { return this.mVelocity; };
//Renderable.prototype.isMouseWithin = function (x,y,dist) {};
//--- end of Public Methods
//</editor-fold>