/* 
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */

/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, mat4: false, vec3: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function Camera(wcCenter, wcWidth, viewportArray) {
    this.mWCCenter = wcCenter;
    this.mWCWidth = wcWidth;
    this.mNearPlane = 0;
    this.mFarPlane = 1000;
    this.setViewport(viewportArray);

    // transformation matrices
    this.mViewMatrix = mat4.create();
    this.mProjMatrix = mat4.create();
    this.mVPMatrix = mat4.create();

    // background color
    this.mBgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
}

// <editor-fold desc="Public Methods">
// <editor-fold desc="Getter/Setter">
// <editor-fold desc="setter/getter of WC and viewport">
Camera.prototype.setWCCenter = function (xPos, yPos) {
    this.mWCCenter[0] = xPos;
    this.mWCCenter[1] = yPos;
};
Camera.prototype.getWCCenter = function () { return this.mWCCenter; };
Camera.prototype.setWCWidth = function (width) { this.mWCWidth = width; };
Camera.prototype.getWCWidth = function () { return this.mWCWidth; };
Camera.prototype.getWCHeight = function () { return this.getWCWidth() * this.mViewport[3] / this.mViewport[2]; };
                                // viewport.Height / viewport.Width
 

Camera.prototype.setViewport = function (viewportArray) { this.mViewport = viewportArray; };
Camera.prototype.getViewport = function () { return this.mViewport; };
//</editor-fold>

//<editor-fold desc="setter/getter of wc background color">
Camera.prototype.setBackgroundColor = function (newColor) { this.mBgColor = newColor; };
Camera.prototype.getBackgroundColor = function () { return this.mBgColor; };

// Getter for the View-Projection transform operator
Camera.prototype.getVPMatrix = function () {
    return this.mVPMatrix;
};
// </editor-fold>
// </editor-fold>

// Initializes the camera to begin drawing
Camera.prototype.setupViewProjection = function () {
    var gl = gEngine.Core.getGL();
    //<editor-fold desc="Step A: Set up and clear the Viewport">
    // Step A1: Set up the viewport: area on canvas to be drawn
    gl.viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
                this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
                this.mViewport[2],  // width of the area to be drawn
                this.mViewport[3]); // height of the area to be drawn
    // Step A2: set up the corresponding scissor area to limit the clear area
    gl.scissor(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
               this.mViewport[1], // y position of bottom-left corner of the area to be drawn
               this.mViewport[2], // width of the area to be drawn
               this.mViewport[3]);// height of the area to be drawn
    // Step A3: set the color to be clear
    gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);  // set the color to be cleared
    // Step A4: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
    //</editor-fold>

    //<editor-fold desc="Step  B: Set up the View-Projection transform operator"> 
    // Step B1: define the view matrix
/* 
    mat4.lookAt(this.mViewMatrix,
        [this.mWCCenter[0], this.mWCCenter[1], 10],   // WC center
        [this.mWCCenter[0], this.mWCCenter[1], 0],    // 
        [0, 1, 0]);     // orientation
    
    // Step B2: define the projection matrix
    var halfWCWidth = 0.5 * this.mWCWidth;
    var halfWCHeight = halfWCWidth * this.mViewport[3] / this.mViewport[2]; // viewportH/viewportW
    
    mat4.ortho(this.mProjMatrix,
        -halfWCWidth,   // distance to left of WC
         halfWCWidth,   // distance to right of WC
        -halfWCHeight,  // distance to bottom of WC
         halfWCHeight,  // distance to top of WC
         this.mNearPlane,   // z-distance to near plane 
         this.mFarPlane  // z-distance to far plane 
    );

    // Step B3: concatenate view and project matrices
    mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);
   */


    var wcHeight = this.mWCWidth  * this.mViewport[3] / this.mViewport[2]; // viewportH/viewportW
    mat4.identity(this.mVPMatrix);
    mat4.scale(this.mVPMatrix, this.mVPMatrix, [2 / this.mWCWidth, 2 / wcHeight, 1]);
    mat4.translate(this.mVPMatrix, this.mVPMatrix, [-this.mWCCenter[0], -this.mWCCenter[1], 0]);

    //</editor-fold>
};

//</editor-fold>