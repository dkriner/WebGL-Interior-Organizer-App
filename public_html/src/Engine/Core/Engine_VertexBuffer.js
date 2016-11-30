/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mSquareTextureCoordBuffer = null;
    var mCircleVertexBuffer = null;
    var mCircleTextureCoordBuffer = null;
    

    
    var initialize = function () {
        var gl = gEngine.Core.getGL();
        
        //----- Square -----//
        var verticesOfSquare = [
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0,
            0.5, -0.5, 0.0,
            -0.5, -0.5, 0.0
        ];

        // fill Vertex buffer
        mSquareVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        mSquareVertexBuffer.itemSize = 3;
        mSquareVertexBuffer.vertCount = 4;

        // map texture
        var squareTexCoords = [
            1, 1,
            0, 1,
            1, 0,
            0, 0,
        ];
        mSquareTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareTexCoords), gl.STATIC_DRAW);
        
        //----- Circle -----//
        var numTriangles = 50;
        var verticesOfCircle = [
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        ];
        (function setCircleVertices() {
            var degPerTriangle = (2 * Math.PI) / numTriangles;
            for (var i = 0; i < numTriangles; i++) {
                var index = 2*3 + i*3;
                var angle = degPerTriangle * (i+1);

                verticesOfCircle[index] = Math.cos(angle); 
                verticesOfCircle[index+1] = Math.sin(angle); 
                verticesOfCircle[index+2] = 0;
            }
        })(); 

        // fill Vertex buffer
        mCircleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfCircle), gl.STATIC_DRAW);
        mCircleVertexBuffer.itemSize = 3;
        mCircleVertexBuffer.vertCount = numTriangles +2;

        // map texture
        var circleTexCoords = [
            0.5,0.5,
            1, 0.5,
        ];
        (function setCircleTexCoords() {
            var degPerTriangle = (2 * Math.PI) / numTriangles;
            for (var i = 0; i < numTriangles; i++) {
                var index = 2*2 + i*2;
                var angle = degPerTriangle * (i+1);

                circleTexCoords[index] = (Math.cos(angle) +1) /2; 
                circleTexCoords[index+1] = (Math.sin(angle) +1) /2; 
            }
        })(); 
        mCircleTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleTexCoords), gl.STATIC_DRAW);
        
    };

    var getGLVertexRefSQUARE = function () { return mSquareVertexBuffer; };
    var getGLTexCoordRefSQUARE = function () { return mSquareTextureCoordBuffer; };
    var getGLVertexRefCIRCLE = function () { return mCircleVertexBuffer; };
    var getGLTexCoordRefCIRCLE = function () { return mCircleTextureCoordBuffer; };

    var mPublic = {
        initialize: initialize,
        getGLVertexRefSQUARE: getGLVertexRefSQUARE,
        getGLVertexRefCIRCLE: getGLVertexRefCIRCLE,
        getGLTexCoordRefSQUARE: getGLTexCoordRefSQUARE,
        getGLTexCoordRefCIRCLE: getGLTexCoordRefCIRCLE,
    };

    return mPublic;
}());