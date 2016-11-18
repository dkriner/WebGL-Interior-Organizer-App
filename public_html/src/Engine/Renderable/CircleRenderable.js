/*
 * File: CircleRenderable.js
 *  
 * draws from the circle vertex buffer
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CircleRenderable(shader) {
    Renderable.call(this, shader);
        // Notice how to call the super class constructor!
        // The constructor takes on paramter, but we are calling it with two arguments!
        // First argument says, "this" is the caller of the constructor
}
gEngine.Core.inheritPrototype(CircleRenderable, Renderable);
// This line MUST be defined right after the constructor
// To get all the methods defined in the super-class.prototype

// Ovreride the super-class "draw()" method!
CircleRenderable.prototype.draw = function (camera) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(
        gEngine.VertexBuffer.getGLVertexRefCIRCLE(),
        this.mColor,        // this is defined in the super class!
        camera.getVPMatrix());  // always activate the shader first!
    this.mShader.loadObjectTransform(this.mXform.getXform());
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 22);
};

// The get/set color, and getXform funcitons are inherited