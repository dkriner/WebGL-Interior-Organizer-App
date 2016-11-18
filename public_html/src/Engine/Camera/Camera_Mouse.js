/* 
 * File: Camera_Input.js
 * Defines the functions that supports mouse input coordinate transforms
 */

/*jslint node: true, vars: true, bitwise: true */
/*global gEngine, Camera, BoundingBox, vec2, CameraShake */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";


Camera.prototype._viewportX = function (dcX) {
    return dcX - this.mViewport[0]; // viewport[0] is left
};
Camera.prototype._viewportY = function (dcY) {
    return dcY - this.mViewport[1]; // viewport[0] is bottom
};

Camera.prototype.isMouseInViewport = function (dcX, dcY) {
    return ((dcX >= this.mViewport[0]) && (dcX < (this.mViewport[0] + this.mViewport[2])) &&  // viewport[2] is width
            (dcY >= this.mViewport[1]) && (dcY < (this.mViewport[1] + this.mViewport[3])));   // viewport[3] is height
};

Camera.prototype.mouseWCX = function (dcX) {
    var minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
    return minWCX + (this._viewportX(dcX) * (this.getWCWidth() / this.mViewport[2]));  // viewport[2] is width
};

Camera.prototype.mouseWCY = function (dcY) {
    var minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
    return minWCY + (this._viewportY(dcY) * (this.getWCHeight() / this.mViewport[3])); // viewport[3] is height
};