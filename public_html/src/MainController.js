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
        {label: "Room"},
        {label: "Parent Bed (Sibling1)"},
        {label: "Child Bed of Parent Bed"},
        {label: "Neighbor Bed (Sibling2)"}
    ];

       // this is the model
    $scope.mMyWorld = new World();
    // $scope.currScene = $scope.mMyWorld.mRoomParent;
    //$scope.currScene = $scope.mMyWorld.mArrayOfBeds[0];
    $scope.currScene = $scope.mMyWorld.mRoomParent; // start by editing entire room
    $scope.mMySceneHandle = new SceneHandle($scope.mMyWorld.mConstColorShader, $scope.currScene);
    $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    $scope.mSelectedEcho = $scope.eSelection[0].label;

    
    $scope.mHandleMode = null;
    $scope.mShouldDrawHandle = true;
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
        
        $scope.mMyWorld.mXfSq.draw($scope.mView);
    };

    $scope.serviceSelection = function () {
        switch ($scope.mSelectedEcho) {
        case $scope.eSelection[0].label:
            $scope.currScene = $scope.mMyWorld.parentScene();
            $scope.mMySceneHandle.setScene($scope.currScene);
            $scope.mSelectedXform = $scope.mMyWorld.parentXform();
            break;
        case $scope.eSelection[1].label:
            $scope.currScene = $scope.mMyWorld.leftChildScene();
            $scope.mMySceneHandle.setScene($scope.currScene);
            $scope.mSelectedXform = $scope.mMyWorld.leftChildXform();
            break;
        case $scope.eSelection[2].label:
            $scope.currScene = $scope.mMyWorld.topChildScene();
            $scope.mMySceneHandle.setScene($scope.currScene);
            $scope.mSelectedXform = $scope.mMyWorld.topChildXform();
            break;
        case $scope.eSelection[3].label:
            $scope.currScene = $scope.mMyWorld.rightChildScene();
            $scope.mMySceneHandle.setScene($scope.currScene);
            $scope.mSelectedXform = $scope.mMyWorld.rightChildXform();
            break;
        }
    };

    $scope.onMouseDown = function (event) {
        if (event.which === 1) { // left
            var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
            var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
            var x = $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
            var y = $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);
            var dist = 0.4;
            
            if ($scope.mMySceneHandle.mouseInTransHandle(x, y, dist))
                $scope.handleMode = "Translate";
            else if ($scope.mMySceneHandle.mouseInRotHandle(x, y, dist))
                $scope.handleMode = "Rotation";
            else if ($scope.mMySceneHandle.mouseInScaleHandle(x, y, dist))
                $scope.handleMode = "Scale";
            
            
            var msPos = [x,y];
            var newScene = getClickedScene(msPos, $scope.mMyWorld.mRoomParent, dist);
            
            if(newScene){
                    $scope.currScene = newScene;
                    $scope.mMySceneHandle.setScene(newScene);
                    //$scope.mSelectedXform = $scope.mMyWorld.topChildXform();
            }
            
            
            function getClickedScene(mousePos, scene, distAllowed){
                
              if(scene.mChildren){ 
                for(var i = scene.mChildren.length - 1; i >= 0; i--){
                    console.log("in the loop!");
                    var clickedScene = getClickedScene(mousePos, scene.mChildren[i], distAllowed);
                    if(clickedScene)
                        break;
                    
                }
              }
                
                
                var localMouse = mousePos;
                //console.log("before Mouse: ", localMouse);
                
                if(scene.mParent)
                    var localMouse = scene.mParent.wcToLocal(localMouse);   
                
                
                //console.log("middle Mouse: ", localMouse);
                
                
                // make mouse position relative to pivot
                localMouse[0] -= scene.getXform().getPivot()[0];
                localMouse[0] -= scene.getXform().getXPos();
                localMouse[1] -= scene.getXform().getPivot()[1];
                localMouse[1] -= scene.getXform().getYPos();
                
                
                 //console.log("after Mouse: ", localMouse);
                
                var dist = Math.sqrt(localMouse[0]*localMouse[0] + localMouse[1]*localMouse[1]);
                    
                if(distAllowed >= dist)
                    return scene;
                
                return clickedScene;
                
                
            }

        }
    };
  

    $scope.onMouseMove = function (event) {
        // TODO: fix bug where mouse position is off if 
        //       the page is reloaded while scrolled down

        var currSceneForm = $scope.currScene.getXform();
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);

        $scope.mMyWorld.mXfSq.getXform().setPosition($scope.mLastWCPosX, $scope.mLastWCPosY);

        // TODO: remove this kelvin code and GUI mosue over
        //$scope.mMyWorld.detectMouseOver($scope.mLastWCPosX, $scope.mLastWCPosY, (event.which===1));

        var pos = [$scope.mLastWCPosX, $scope.mLastWCPosY];

        // convert mouse position to parent's local coords 
        if ($scope.currScene.mParent) 
            pos = $scope.currScene.mParent.wcToLocal(pos);

        // make mouse position relative to pivot
        pos[0] -= $scope.currScene.getXform().getPivot()[0];
        pos[0] -= $scope.currScene.getXform().getXPos();
        pos[1] -= $scope.currScene.getXform().getPivot()[1];
        pos[1] -= $scope.currScene.getXform().getYPos();

        if (event.which === 1 && $scope.handleMode) {
            if ($scope.handleMode === "Translate") {
                // assign position to mouse coords offset from pivot
                pos[0] += $scope.currScene.getXform().getXPos();
                pos[1] += $scope.currScene.getXform().getYPos();
                currSceneForm.setPosition(pos[0], pos[1]);
            }
            else if ($scope.handleMode === "Rotation") {
                // TODO: figure out why this doesn't work when parent is scaled
                // // calculate mouse position angle to pivot
                // var rot = Math.PI/2 - Math.atan2(pos[0],pos[1]);
                // currSceneForm.setRotationInRad(rot);

                // TODO: and why this does work
                var relPos = [ // mouse position relative to scene handle center
                    $scope.mLastWCPosX - $scope.mMySceneHandle.getXform().getXPos(),
                    $scope.mLastWCPosY - $scope.mMySceneHandle.getXform().getYPos()
                ];

                var rot = Math.PI/2 - Math.atan2(relPos[0],relPos[1]);
                if ($scope.currScene.mParent) 
                    rot -= $scope.currScene.mParent.getWCRotation();
                currSceneForm.setRotationInRad(rot);
            }
            else if ($scope.handleMode === "Scale") {
                // TODO: figure out why this doesn't work when scene rotated
                // currSceneForm.setSize(pos[0]+1,pos[1]);

                // TODO: and why this does work
                var relPos = [ // mouse position relative to scene handle center
                    $scope.mLastWCPosX - $scope.mMySceneHandle.getXform().getXPos(),
                    $scope.mLastWCPosY - $scope.mMySceneHandle.getXform().getYPos()
                ];

                var rotMat = mat4.create(); // reverse the scene's rotation
                mat4.rotateZ(rotMat, rotMat, -$scope.mMySceneHandle.getXform().getRotationInRad());
                var relPosWC = vec2.transformMat4(vec2.create(), relPos, rotMat);

                // TOOD: clamp scale

                currSceneForm.setSize(relPosWC[0]+1,relPosWC[1]);
            }
        }
        else $scope.handleMode = null;
    };
});