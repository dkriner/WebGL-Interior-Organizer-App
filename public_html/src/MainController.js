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
myModule.controller("MainCtrl", function ($scope) 
{
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');
    
    // Radio button selection support
//    $scope.eSelection = [
//        {label: "Bed"},
//        {label: "Ceiling Fan"}
//        //add more
//    ];

    // All the mouse coordinate points
    $scope.mClientX = 0;
    $scope.mClientY = 0;
    $scope.mCanvasX = 0;
    $scope.mCanvasY = 0;
    $scope.mViewportX = 0;
    $scope.mViewportY = 0;
    $scope.mCameraX = 0;
    $scope.mCameraY = 0;
    $scope.mWhichCamera = "Large";

    $scope.mCameras = [];
    
    // this is the model
    $scope.mMyWorld = new World();

    $scope.currScene = $scope.mMyWorld.mRoomParent; // start by editing entire room
    $scope.mMySceneHandle = new SceneHandle($scope.mMyWorld.mConstColorShader, $scope.currScene);
    $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    //$scope.mSelectedEcho = $scope.eSelection[0].label;

    $scope.mHandleMode = null;
    $scope.mShouldDrawHandle = true;
    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;

    // small view support
    $scope.setViewWC = function (camera) 
    {
        var i;
        var cam = camera;
        
        if (cam.mName === $scope.mCameraNames[0])
            i = 0;
        else if (cam.mName === $scope.mCameraNames[1])
            i = 1;
        else if (cam.mName === $scope.mCameraNames[2])
            i = 2;
                
        cam.setWCWidth(parseInt($scope.mWCWidths[i]));
    };
    
    $scope.setViewWCCenter = function (camera) 
    {
        var i;
        var cam = camera;
        
        if (cam.mName === $scope.mCameraNames[0])
            i = 0;
        else if (cam.mName === $scope.mCameraNames[1])
            i = 1;
        else if (cam.mName === $scope.mCameraNames[2])
            i = 2;
        
        cam.setWCCenter(
            parseInt($scope.mWCCenters[i][0]),
            parseInt($scope.mWCCenters[i][1])
        );
    };
    
    $scope.setViewport = function (camera) 
    {
        var i;
        var cam = camera;
        var viewPort = cam.getViewport();
        
        if (cam.mName === $scope.mCameraNames[0])
            i = 0;
        else if (cam.mName === $scope.mCameraNames[1])
            i = 1;
        else if (cam.mName === $scope.mCameraNames[2])
            i = 2;
        
        for (var j=0; j<4; j++)
            viewPort[i] = parseInt($scope.mViewPorts[i][j]);
    };

    $scope.mCameraNames = ["Large", "Floor", "Floor+Ceiling"];
    $scope.mWCWidths = [15, 15, 15];
    $scope.mWCCenters = [[0, 3], 
                         [0, 3], 
                         [0, 3]
                        ];
    $scope.mViewPorts = [[0, 0, 800, 600],
                         [800, 250, 200, 150], 
                         [800, 425, 200, 150]
                        ];

//    $scope.mWCWidths.push(15);
//    $scope.mWCCenters.push([0, 3]);
//    $scope.mViewPorts.push([0, 0, 800, 600]);
//
//    $scope.mWCWidths.push($scope.mWCWidths[0]);  // WC coordinates
//    $scope.mWCCenters.push([$scope.mWCCenters[0][0]], $scope.mWCCenters[0][1]);
//    $scope.mViewPorts.push([800, 250, 200, 150]);// size of VP window that we look through
//    
//    $scope.mWCWidths.push($scope.mWCWidths[0]);  // WC coordinates
//    $scope.mWCCenters.push([$scope.mWCCenters[0][0]], $scope.mWCCenters[0][1]); // center of VP window (in WC coord) that we're looking through
//    $scope.mViewPorts.push([800, 450, 200, 150]);// size of VP window that we look through 
    
    // Create 3 cameras
    for (var i = 0; i < $scope.mCameraNames.length; i++)
    {
        var cam = new Camera(
                    [$scope.mWCCenters[i][0], $scope.mWCCenters[i][1]],   // wc Center
                     $scope.mWCWidths[i],                                 // wc Wdith
                    [$scope.mViewPorts[i][0], $scope.mViewPorts[i][1], 
                     $scope.mViewPorts[i][2], $scope.mViewPorts[i][3]],   // viewport: left, bottom, width, height
                     $scope.mCameraNames[i]);                             // camera name

        cam.setBackgroundColor([1, 1, 1, 1]);

          // TODO: determine problem in the three functions listed below
//        if (cam.mName !== "Large")
//        {
//            $scope.setViewWC(cam);
//            $scope.setViewWCCenter(cam);
//            $scope.setViewport(cam);
//        }
        
        $scope.mCameras.push(cam);  // acces cameras through array
    }
        
    // ********************************************
    //                 square areas
    // ********************************************
    // Large viewport
    $scope.largeVPSquareArea = new SquareArea($scope.mCameras[0]);
    $scope.largeVPSquareArea.setColor([0,1,0,1]);

    // Floor (small viewport)
    $scope.floorSquareArea = new SquareArea($scope.mCameras[1]);
    $scope.floorSquareArea.setColor([1,1,1,1]);

    // Floor+Ceiling (small viewport)
    $scope.floorCeilingSquareArea = new SquareArea($scope.mCameras[2]);
    $scope.floorCeilingSquareArea.setColor([0,0,1,1]);

    $scope.mainTimerHandler = function () 
    {
        // 1. update the world
        //$scope.mMyWorld.update();
        
        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas

        // ********************************************
        //        draw large view and handles
        // ********************************************
        $scope.mMyWorld.draw($scope.mCameras[0]);
        if ($scope.mShouldDrawHandle)
            $scope.mMySceneHandle.draw($scope.mCameras[0]);
        $scope.mMyWorld.mXfSq.draw($scope.mCameras[0]);           // Draw mouse box (in case of browser zooming-in allignment bug)
        // TODO: determine why drawing square area blocks future drawing from inside the square
        //$scope.largeVPSquareArea.draw($scope.mCameras[0]);

        // ********************************************
        //         draw small floor + ceiling
        // ********************************************
        $scope.mMyWorld.draw($scope.mCameras[2]);
        //$scope.floorCeilingSquareArea.draw($scope.mCameras[2]);
        
        // ********************************************
        //              draw small floor 
        // ********************************************
        $scope.mMyWorld.draw($scope.mCameras[1]);
        //$scope.floorSquareArea.draw($scope.mCameras[1]);
    };

    $scope.computeWCPos = function (event) 
    {
        var wcPos = [0, 0];
        $scope.mClientX = event.clientX;
        $scope.mClientY = event.clientY;
        
        $scope.mCanvasX = $scope.mCanvasMouse.getPixelXPos(event);
        $scope.mCanvasY = $scope.mCanvasMouse.getPixelYPos(event);
        if(!$scope.isDragging)
        {
            $scope.useCam = $scope.mCameras[0]; // assume using this camera
            $scope.mWhichCamera = "Large";
            
            if ($scope.mCameras[1].isMouseInViewport($scope.mCanvasX, $scope.mCanvasY)) {
                $scope.useCam = $scope.mCameras[1];
                $scope.mWhichCamera = "Floor";
            }
            else if ($scope.mCameras[2].isMouseInViewport($scope.mCanvasX, $scope.mCanvasY)) {
                $scope.useCam = $scope.mCameras[2];
                $scope.mWhichCamera = "Floor+Ceiling";
                
            }
        }
        
        // these are "private functions" on the camera, 
        // for the purpose of clear illustration, we will call them
        $scope.mViewportX = $scope.useCam._viewportX($scope.mCanvasX);
        $scope.mViewportY = $scope.useCam._viewportY($scope.mCanvasY);
        
        wcPos[0] = $scope.useCam.mouseWCX($scope.mCanvasX);
        wcPos[1] = $scope.useCam.mouseWCY($scope.mCanvasY);
        $scope.mCameraX = wcPos[0];
        $scope.mCameraY = wcPos[1];
        return wcPos;
    };

//    $scope.setVPPos = function(wcX,wcY) 
//    {
//        $scope.mSmallViewport[0] = $scope.mCanvasX - $scope.mSmallViewport[2] / 2;
//        $scope.mSmallViewport[1] = $scope.mCanvasY - $scope.mSmallViewport[3] / 2;
//        $scope.setSmallViewport();
//    };

//    $scope.setWCPos = function(wcX,wcY) 
//    {
//        $scope.mWCCenters[2][0] = wcX;
//        $scope.mWCCenters[2][0] = wcY;
//        $scope.setSmallViewWCCenter();
//    };
    
    $scope.addFurniture = function (selection) {
        var item = new SquareRenderable($scope.mMyWorld.mConstColorShader);
        item.setTexture($scope.mMyWorld.textures[selection]);
        item.getXform().setSize(2, 2);

        // create scene for sceneHandle functionality
        // TODO: make scenehandle work with renderables too
        var scene = new SceneNode($scope.mMyWorld.mConstColorShader, selection, false);
        scene.addToSet(item);

        $scope.mMyWorld.addFurniture(scene);
    };

    $scope.onMouseDown = function (event) 
    {
        if (event.which === 1) { // left
            var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
            var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
            var x = $scope.mLastWCPosX = this.mCameras[0].mouseWCX(canvasX);
            var y = $scope.mLastWCPosY = this.mCameras[0].mouseWCY(canvasY);
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
                    //console.log("in the loop!");
                    var clickedScene = getClickedScene(mousePos, scene.mChildren[i], distAllowed);
                    if(clickedScene) return clickedScene;
                    
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
  
    $scope.onMouseMove = function (event) 
    {
        // TODO: fix bug where mouse position is off if 
        //       the page is reloaded while scrolled down

        var currSceneForm = $scope.currScene.getXform();
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mCameras[0].mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mCameras[0].mouseWCY(canvasY);

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