/*
 * File: SquareRenderable.js
 *  
 * draws from the square vertex buffer
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SquareRenderable(shader) {
    Renderable.call(this, shader);
        // Notice how to call the super class constructor!
        // The constructor takes on paramter, but we are calling it with two arguments!
        // First argument says, "this" is the caller of the constructor
}
gEngine.Core.inheritPrototype(SquareRenderable, Renderable);
// This line MUST be defined right after the constructor
// To get all the methods defined in the super-class.prototype

// Ovreride the super-class "draw()" method!
SquareRenderable.prototype.draw = function (camera, parentMat) {
    Renderable.prototype.draw.call(this, camera);

    var gl = gEngine.Core.getGL();
    var vertexBuffer = gEngine.VertexBuffer.getGLVertexRefSQUARE();
    var texCoordBuffer = gEngine.VertexBuffer.getGLTexCoordRefSQUARE();
    this.mShader.activateShader(
        vertexBuffer,
        texCoordBuffer,
        this.mColor,        // this is defined in the super class!
        camera.getVPMatrix());  // always activate the shader first!
    this.computeAndLoadModelXform(parentMat);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.vertCount);
};

//SquareRenderable.prototype.isMouseWithin = function (wcX, wcY, dist){
//    
//};
//
//SquareRenderable.prototype.withInBound = function (p, wc, kBoundTol) {
//    return ( ((p[0] - kBoundTol) < wc[0]) && (wc[0] < (p[0] + kBoundTol)) &&
//             ((p[1] - kBoundTol) < wc[1]) && (wc[1] < (p[1] + kBoundTol)) );
//};

// The get/set color, and getXform funcitons are inherited