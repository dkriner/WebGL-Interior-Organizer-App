/*
 * File: CanvasMouseSupport.js 
 * Provides support for computing mouse pixel position in the main drawing canvas
 */
/*jslint node: true, vars: true */
/*global document */
/* find out more about jslint: http://www.jslint.com/help.html */


"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CanvasMouseSupport(canvasID) {
    var canvas = document.getElementById(canvasID);
    var canvasBounds = canvas.getBoundingClientRect();
    this.mCanvasWidth = canvas.width;
    this.mCanvasHeight = canvas.height;
    this.mCanvasBoundsTop = canvasBounds.top;
    this.mCanvasBoundsLeft = canvasBounds.left;
    this.mCanvasXRatio = this.mCanvasWidth / canvasBounds.width;
    this.mCanvasYRatio = this.mCanvasHeight / canvasBounds.height;
}

CanvasMouseSupport.prototype.getPixelXPos = function (event) {
    return Math.round((event.clientX -  this.mCanvasBoundsLeft) * this.mCanvasXRatio);
};
CanvasMouseSupport.prototype.getPixelYPos = function (event) {
    var y  = Math.round((event.clientY -  this.mCanvasBoundsTop) * this.mCanvasYRatio);
    return (this.mCanvasHeight - 1  - window.pageYOffset - y);
};