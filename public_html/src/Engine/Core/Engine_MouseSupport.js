/*
 * File: EngineCore_Input.js 
 * Provides input support
 */
/*jslint node: true, vars: true */
/*global document, window*/
/* find out more about jslint: http://www.jslint.com/help.html */


"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.MouseSupport = (function () {

    // Support mouse
    var mCanvas = null;
    var mCanvasBounds;
    var mCanvasXRatio;
    var mCanvasYRatio;

    var initialize = function (canvasID) {
        mCanvas = document.getElementById(canvasID);
        mCanvasBounds = mCanvas.getBoundingClientRect();
        mCanvasXRatio = mCanvas.width / mCanvasBounds.width;
        mCanvasYRatio = mCanvas.height / mCanvasBounds.height;
    };

    var computePixelPos = function (pos, event) {
        var inside = false;
        // In Canvas Space now. Convert via ratio from canvas to client.
        pos[0] = Math.round((event.clientX -  mCanvasBounds.left) * mCanvasXRatio);
        pos[1] = Math.round((event.clientY -  mCanvasBounds.top) * mCanvasYRatio);

        if ((pos[0] >= 0) && (pos[0] < mCanvas.width) &&
            (pos[1] >= 0) && (pos[1] < mCanvas.height)) {
            pos[1] = mCanvas.height - 1 - pos[1];
            inside = true;
        }
        return inside;
    };

    var mPublic = {
        initialize: initialize,
        computePixelPos: computePixelPos
    };
    return mPublic;
}());