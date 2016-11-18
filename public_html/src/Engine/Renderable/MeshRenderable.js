/*
 * File: MeshRenderable.js
 *  
 * Loads an OBJ mesh and draws it (no texture or material support)
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable, Math, OBJ */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Assuming meshFile is a valid file name
function MeshRenderable(shader, meshInString) {
    Renderable.call(this, shader);
    this.mMesh = new OBJ.Mesh(meshInString);
    OBJ.initMeshBuffers(gEngine.Core.getGL(), this.mMesh);
    var xf = this.getXform();   // sets some meaningful init vales for now
    xf.setSize(30, 30);
    this.setColor([Math.random(), Math.random(), Math.random(), 1.0]);
}
gEngine.Core.inheritPrototype(MeshRenderable, Renderable);

// Ovreride the super-class "draw()" method!
MeshRenderable.prototype.draw = function (camera, parentMat) {
    if (this.mMesh === null)
        return;  // loading not donw yet!
    
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(
        this.mMesh.vertexBuffer,
        this.mColor,        // this is defined in the super class!
        camera.getVPMatrix());  // always activate the shader first!
    this.computeAndLoadModelXform(parentMat);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mMesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.mMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};