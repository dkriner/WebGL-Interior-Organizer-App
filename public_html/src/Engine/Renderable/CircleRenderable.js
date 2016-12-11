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
CircleRenderable.prototype.draw = function (camera, parentMat) {
    Renderable.prototype.draw.call(this, camera);

    var gl = gEngine.Core.getGL();
    var vertexBuffer = gEngine.VertexBuffer.getGLVertexRefCIRCLE();
    var texCoordBuffer = gEngine.VertexBuffer.getGLTexCoordRefCIRCLE();
    this.mShader.activateShader(
        vertexBuffer,
        texCoordBuffer,
        this.mColor,        // this is defined in the super class!
        camera.getVPMatrix());  // always activate the shader first!
    this.computeAndLoadModelXform(parentMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexBuffer.vertCount);
};

//CircleRenderable.prototype.isMouseWithin = function(wcX, wcY, dist){
//    var mousePos = [wcX, wcY];
//    
//    if(this.mParent){
//        //convert mouse coord to parent coord
//        this.mParent.wcToLocal(mousePos);
//        return (this.withInBound(this.mParent.getXform().getPos(), mousePos, dist));
//    }
//    
//    return (this.withInBound(this.mParent.getXform().getPos(), mousePos, dist));
//};
//
//CircleRenderable.prototype.wcToLocal = function(coords) {
//    var m = mat4.invert(mat4.create(), this._getXFormStack());
//    return vec2.transformMat4(vec2.create(), coords, m);
//};
//
//CircleRenderable.prototype.withInBound = function (p, wc, kBoundTol) {
//    return ( ((p[0] - kBoundTol) < wc[0]) && (wc[0] < (p[0] + kBoundTol)) &&
//             ((p[1] - kBoundTol) < wc[1]) && (wc[1] < (p[1] + kBoundTol)) );
//};

// The get/set color, and getXform funcitons are inherited