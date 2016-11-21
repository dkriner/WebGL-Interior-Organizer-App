/* 
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, World, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample", ["CSS450Timer", "CSS450Slider", "CSS450Xform"]);

// registers the constructor for the controller
// NOTE: the constructor is only called _AFTER_ the </body> tag is encountered
//       this code does NOT run until the end of loading the HTML page
myModule.controller("MainCtrl", function ($scope) {
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');
    
    // Radio button selection support
    $scope.eSelection = [
        {label: "Parent"},
        {label: "LeftChild"},
        {label: "TopChild"},
        {label: "RightChild"},
    ];

       // this is the model
    $scope.mMyWorld = new World();
    $scope.currScene = $scope.mMyWorld.mParent;
    $scope.mMySceneHandle = new SceneHandle($scope.mMyWorld.mConstColorShader, $scope.currScene);
    $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    $scope.mSelectedEcho = $scope.eSelection[0].label;
    
    $scope.mHandleMode = null;
    $scope.mShouldDrawHandle = false;
    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;

    $scope.mView = new Camera(
                [0, 3],             // wc Center
                15,                 // wc Wdith
                [0, 0, 800, 600]);  // viewport: left, bottom, width, height

    $scope.mainTimerHandler = function () {
        // 1. update the world
        $scope.mMyWorld.update();
        
        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
        //
        // $scope.mMyWorld.update();
        $scope.mMyWorld.draw($scope.mView);
        if ($scope.mShouldDrawHandle)
            $scope.mMySceneHandle.draw($scope.mView);
    };

    $scope.serviceSelection = function () {
        switch ($scope.mSelectedEcho) {
        case $scope.eSelection[0].label:
            $scope.mSelectedXform = $scope.mMyWorld.parentXform();
            break;
        case $scope.eSelection[1].label:
            $scope.mSelectedXform = $scope.mMyWorld.leftChildXform();
            break;
        case $scope.eSelection[2].label:
            $scope.mSelectedXform = $scope.mMyWorld.topChildXform();
            break;
        case $scope.eSelection[3].label:
            $scope.mSelectedXform = $scope.mMyWorld.rightChildXform();
            break;
        }
    };

    $scope.onMouseDown = function (event) {
        if (event.which === 1) { // left

//            var x = $scope.mLastWCPosX = this.mView.mouseWCX(event.canvasX);
//            var y = $scope.mLastWCPosY = this.mView.mouseWCY(event.canvasY);
//            var dist = 0.5;

            var x = $scope.mLastWCPosX;
            //this.mView.mouseWCX(event.canvasX);
            var y = $scope.mLastWCPosY;
            //this.mView.mouseWCY(event.canvasY);
            var dist = 0.2;
            
            if ($scope.mMySceneHandle.mouseInTransHandle(x, y, dist))
                $scope.handleMode = "Translate";
            else if ($scope.mMySceneHandle.mouseInRotHandle(x, y, dist))
                $scope.handleMode = "Rotation";
            else if ($scope.mMySceneHandle.mouseInScaleHandle(x, y, dist))
                $scope.handleMode = "Scale";
        }
    };

    $scope.onMouseMove = function (event) {
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        var x = $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
        var y = $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);
        $scope.mMouseOver = $scope.mMyWorld.detectMouseOver($scope.mLastWCPosX, $scope.mLastWCPosY, (event.which===1));

        if (event.which === 1 && $scope.handleMode) {
            if ($scope.handleMode === "Translate")
                $scope.currScene.getXForm().setPosition(x, y);
            else if ($scope.handleMode === "Rotation") 
                $scope.currScene.getXForm().setRotationInRad(Math.atan2(x,y));
            else if ($scope.handleMode === "Scale")
                ; // TODO $scope.currScene.getXForm()
        }
        else $scope.handleMode = null;
    };
});