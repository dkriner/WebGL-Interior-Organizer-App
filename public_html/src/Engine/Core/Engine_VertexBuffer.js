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
    var mCircleVertexBuffer = null;
    var numTriangles;

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // remaining vertices are computed using cos and sin in initialize()
    var verticesOfCircle = [
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0
    ];

    var setCircleVertices = function () {
        // set remaining circle vertices
        numTriangles = 20;
        var degPerTriangle = (2 * Math.PI) / numTriangles;
        for (var i = 0; i < numTriangles; i++) 
        {
            var index = 2*3 + i*3;
            var angle = degPerTriangle * (i+1);

            verticesOfCircle[index] = Math.cos(angle); 
            verticesOfCircle[index+1] = Math.sin(angle); 
            verticesOfCircle[index+2] = 0;
        }

    };

    var initialize = function () {
        var gl = gEngine.Core.getGL();
        setCircleVertices();
        
        // Square
        mSquareVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        mSquareVertexBuffer.itemSize = 3;
        mSquareVertexBuffer.numSize = 4;
        
        // Circle
        // Step A: Create a buffer on the gGL context for our vertex positions
        mCircleVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfCircle), gl.STATIC_DRAW);
        mCircleVertexBuffer.itemSize = 3;
        mCircleVertexBuffer.numSize = numTriangles;
    };

    var getGLVertexRefSQUARE = function () { return mSquareVertexBuffer; };
    var getGLVertexRefCIRCLE = function () { return mCircleVertexBuffer; };

    var mPublic = {
        initialize: initialize,
        getGLVertexRefSQUARE: getGLVertexRefSQUARE,
        getGLVertexRefCIRCLE: getGLVertexRefCIRCLE
    };

    return mPublic;
}());