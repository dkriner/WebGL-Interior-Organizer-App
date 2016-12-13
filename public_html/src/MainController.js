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
myModule.controller("MainCtrl", function ($scope){
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');

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
    $scope.mDrawCeiling = true;
    $scope.floorDesignScale = 3;
    $scope.mItemXDim = 0.0;
    $scope.mItemYDim = 0.0;
    $scope.mItemXPos = 0.0;
    $scope.mItemYPos = 0.0;

    $scope.mCameras = [];
    
    // this is the model
    $scope.mMyWorld = new World();

    $scope.currScene = null;
    $scope.mMySceneHandle = new SceneHandle($scope.mMyWorld.mShader, $scope.currScene);
    // $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    //$scope.mSelectedEcho = $scope.eSelection[0].label;

    $scope.mHandleMode = null;
    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;

    // small view support
    $scope.setViewWC = function (camera){
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
    
    $scope.setViewWCCenter = function (camera){
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
    
    $scope.setViewport = function (camera){
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
                         [800, 250, 200, 155], 
                         [800, 425, 200, 155]

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
    for (var i = 0; i < $scope.mCameraNames.length; i++){
        var cam = new Camera(
                    [$scope.mWCCenters[i][0], $scope.mWCCenters[i][1]],   // wc Center
                     $scope.mWCWidths[i],                                 // wc Wdith
                    [$scope.mViewPorts[i][0], $scope.mViewPorts[i][1], 
                     $scope.mViewPorts[i][2], $scope.mViewPorts[i][3]],   // viewport: left, bottom, width, height
                     $scope.mCameraNames[i]);                             // camera name

        cam.setBackgroundColor([0.6, 0, 0, 1]);
        
        $scope.mCameras.push(cam);  // acces cameras through array
    }
        
    // ********************************************
    //                 square areas
    // ********************************************
    // Large viewport
    // $scope.largeVPSquareArea = new SquareArea($scope.mCameras[0]);
    // $scope.largeVPSquareArea.setColor([0,1,0,1]);

    // Floor (small viewport)
    $scope.floorSquareArea = new SquareArea($scope.mCameras[1]);
    $scope.floorSquareArea.setColor([0,1,0,1]);

    // Floor+Ceiling (small viewport)
    $scope.floorCeilingSquareArea = new SquareArea($scope.mCameras[2]);
    $scope.floorCeilingSquareArea.setColor([0,1,0,1]);

    $scope.mainTimerHandler = function (){
        gEngine.Core.clearCanvas([0.6, 0, 0, 1]);

        // ********************************************
        //        draw large view and handles
        // ********************************************
        $scope.mMyWorld.draw($scope.mCameras[0], $scope.mDrawCeiling);
        $scope.mMySceneHandle.draw($scope.mCameras[0]);

        // Draw mouse box (in case of browser zooming-in allignment bug)
        $scope.mMyWorld.mXfSq.draw($scope.mCameras[0]);
        // TODO: determine why drawing square area blocks future drawing from inside the square
        // $scope.largeVPSquareArea.draw($scope.mCameras[0]);

        // ********************************************
        //         draw small floor + ceiling
        // ********************************************
        
        //$scope.mMyWorld.draw($scope.mCameras[2]);
        $scope.floorCeilingSquareArea.draw($scope.mCameras[2], $scope.mMyWorld, $scope.mDrawCeiling, true);
        //$scope.floorCeilingSquareArea.draw($scope.mCameras[2]);
        
        // ********************************************
        //              draw small floor 
        // ********************************************
        //$scope.mMyWorld.draw($scope.mCameras[1]);
        $scope.floorSquareArea.draw($scope.mCameras[1], $scope.mMyWorld, !$scope.mDrawCeiling, false);
    };

    $scope.computeWCPos = function (event){
        var wcPos = [0, 0];
        $scope.mClientX = event.clientX;
        $scope.mClientY = event.clientY;
        $scope.mCanvasX = $scope.mCanvasMouse.getPixelXPos(event);
        $scope.mCanvasY = $scope.mCanvasMouse.getPixelYPos(event);
 
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
    
    // add furniture item
    $scope.addFurniture = function (selection) {
        var item = new SquareRenderable($scope.mMyWorld.mShader);
        var texImg = $scope.mMyWorld.textures[selection].image;
        var ratio = texImg.naturalHeight / texImg.naturalWidth;
        item.setTexture($scope.mMyWorld.textures[selection]);
        // TODO: set size relative to real world units
        item.getXform().setSize(3, 3 * ratio);

        // create scene for sceneHandle functionality
        // TODO: make scenehandle work with renderables too
        var scene = new SceneNode($scope.mMyWorld.mShader, selection, false);
        scene.addToSet(item);
        
        $scope.mMyWorld.mRoom.addFurniture(scene);
        //$scope.mItemXDim = scene.getXform().getWidth();
        //$scope.mItemYDim = scene.getXform().getHeight();
    };
    
    
    /*
    $scope.changeSceneWidth = function(){
        if($scope.currScene){
            var newWidth = document.getElementById('xDimension').value;
            $scope.currScene.getXform().setSize(newWidth, $scope.currScene.getXform().getHeight());
            $scope.mItemXDim = newWidth;
        }
    };
    $scope.changeSceneLength = function(){
        if($scope.currScene){
            var newLength = document.getElementById('yDimension').value;
            $scope.currScene.getXform().setSize($scope.currScene.getXform().getWidth(), newLength);
            $scope.mItemYDim = newLength;
        }
    };
    $scope.changeSceneX = function() {
        if($scope.currScene){
            var newX = document.getElementById('xPos').value;           //value the user entered (X)
            var sceneForm = $scope.currScene.getXform();        //xform
            //new room coordinates
            sceneForm.setPosition(newX, sceneForm.getYPos());    
            
        }
    };
   
    $scope.changeSceneX = function() {
        
    };
    
    */
    //Fine tuners call these functions for making small adjustments to items
    $scope.incrXDim = function(){ 
        if($scope.currScene){
            var sceneForm = $scope.currScene.getXform();
            if(sceneForm.getWidth() >= 0)
                sceneForm.setSize(sceneForm.getWidth() + 0.01, sceneForm.getHeight());
            else
                sceneForm.setSize(sceneForm.getWidth() - 0.01, sceneForm.getHeight());
            $scope.mItemXDim = Math.abs((sceneForm.getWidth()).toFixed(2));
        }
    };
    $scope.incrYDim = function(){
        if($scope.currScene){
            var sceneForm = $scope.currScene.getXform();
            if(sceneForm.getHeight() >= 0)
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() + 0.01);
            else
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() - 0.01);
            $scope.mItemYDim = Math.abs((sceneForm.getHeight()).toFixed(2));
        }
    };
    $scope.decXDim = function(){
        if($scope.currScene){
            var sceneForm = $scope.currScene.getXform();
            if(sceneForm.getWidth() >= 0)
                sceneForm.setSize(sceneForm.getWidth() - 0.01, sceneForm.getHeight());
            else
                sceneForm.setSize(sceneForm.getWidth() + 0.01, sceneForm.getHeight());
            $scope.mItemXDim = Math.abs((sceneForm.getWidth()).toFixed(2));
        }
    
        
    };
    $scope.decYDim = function(){
        if($scope.currScene){
            var sceneForm = $scope.currScene.getXform();
            if(sceneForm.getHeight() >= 0)
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() - 0.01);
            else
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() + 0.01);
            $scope.mItemYDim = (sceneForm.getHeight()).toFixed(2);
        }
        
    };
    $scope.incrXPos = function(){
          if($scope.currScene){
                var itemRoomCoords = $scope.currScene.wcToRoomScale([$scope.currScene.getXform().getXPos(), $scope.currScene.getXform().getYPos()]);
                
                $scope.currScene.getXform().setPosition($scope.currScene.getXform().getXPos()+0.01, $scope.currScene.getXform().getYPos());
                $scope.mItemXPos = (itemRoomCoords[0]+0.01).toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
    };
    $scope.incrYPos = function(){
        if($scope.currScene){
                var itemRoomCoords = $scope.currScene.wcToRoomScale([$scope.currScene.getXform().getXPos(), $scope.currScene.getXform().getYPos()]);
                
                $scope.currScene.getXform().setPosition($scope.currScene.getXform().getXPos(), $scope.currScene.getXform().getYPos()+0.01);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = (itemRoomCoords[1]+0.01).toFixed(2);
            }
    };
    $scope.decXPos = function(){
        if($scope.currScene){
                var itemRoomCoords = $scope.currScene.wcToRoomScale([$scope.currScene.getXform().getXPos(), $scope.currScene.getXform().getYPos()]);
                
                $scope.currScene.getXform().setPosition($scope.currScene.getXform().getXPos()-0.01, $scope.currScene.getXform().getYPos());
                $scope.mItemXPos = (itemRoomCoords[0]-0.01).toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
    };
    $scope.decYPos = function(){
        if($scope.currScene){
                var itemRoomCoords = $scope.currScene.wcToRoomScale([$scope.currScene.getXform().getXPos(), $scope.currScene.getXform().getYPos()]);
                
                $scope.currScene.getXform().setPosition($scope.currScene.getXform().getXPos(), $scope.currScene.getXform().getYPos()-0.01);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = (itemRoomCoords[1]-0.01).toFixed(2);
            }
    };

    // delete furniture item
    $scope.deleteItem = function () {
        if ($scope.currScene && $scope.currScene.mParent)
            $scope.currScene.mParent.removeChild($scope.currScene);

        $scope.mMySceneHandle.setScene(null);
        $scope.currScene = null;
        $scope.mItemXDim = 0.0;
        $scope.mItemYDim = 0.0;
        $scope.mItemXPos = 0.0;
        $scope.mItemYPos = 0.0;
        
    };
    
    $scope.changeColor = function (){
        //CHANGE THE COLOR (TINT) OF THE SELECTED FURNITURE ITEM
        
    };
    
    $scope.editTexture = function(selection){
        //CHANGE TEXTURE OF SELECTED OBJECT
    };

    $scope.acceptTexFile = function (event) {
        var reader = new FileReader();
        reader.onload = function () {
            $scope.mMyImage = new Image();
            $scope.mMyImage.src = reader.result;
            var texture = new Texture(reader.result);
            $scope.mMyWorld.mRoom.setFloorPattern(texture);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    $scope.setFloorDesignScale = function () {
        $scope.mMyWorld.mRoom.setFloorPatternScale($scope.floorDesignScale);
    };
    
    $scope.checkViewSelection = function(canvasX, canvasY){
        if ($scope.mCameras[1].isMouseInViewport(canvasX, canvasY))
            $scope.mDrawCeiling = false;
        else if($scope.mCameras[2].isMouseInViewport(canvasX, canvasY))
            $scope.mDrawCeiling = true;    
    };

    $scope.onMouseDown = function (event){
        if (event.which === 1) { // left          
            var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
            var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
            var x = $scope.mLastWCPosX = this.mCameras[0].mouseWCX(canvasX);
            var y = $scope.mLastWCPosY = this.mCameras[0].mouseWCY(canvasY);
            var dist = 0.4;

            //check if user is selecting a new view
            $scope.checkViewSelection(canvasX, canvasY); 
            
            // scene handle code
            if ($scope.mMySceneHandle.mouseInTransHandle(x, y, dist))
                $scope.handleMode = "Translate";
            else if ($scope.mMySceneHandle.mouseInRotHandle(x, y, dist))
                $scope.handleMode = "Rotation";
            else if ($scope.mMySceneHandle.mouseInScaleHandle(x, y, dist))
                $scope.handleMode = "Scale";
            else $scope.handleMode = null;

            if ($scope.handleMode) return;
            
            // scene selection code            
            var newScene = null;
            if ($scope.mDrawCeiling) newScene = getClickedChild([x,y], $scope.mMyWorld.mRoom.ceiling, dist);
            if (!newScene) newScene = getClickedChild([x,y], $scope.mMyWorld.mRoom.floor, dist);
            
            if(newScene){
                $scope.mItemXDim = newScene.getXform().getWidth();
                $scope.mItemYDim = newScene.getXform().getHeight();
                
                var itemRoomCoords = newScene.wcToRoomScale([newScene.getXform().getXPos(), newScene.getXform().getYPos()]);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
            
            $scope.currScene = newScene;
            $scope.mMySceneHandle.setScene(newScene);
            //$scope.mSelectedXform = $scope.mMyWorld.topChildXform();
            
            // returns child in scene that was clicked or null
            function getClickedChild(mousePos, scene, distAllowed, _isChild){
                if(scene.mChildren){ 
                    for(var i = scene.mChildren.length - 1; i >= 0; i--){
                        var clickedScene = getClickedChild(mousePos, scene.mChildren[i], distAllowed, true);
                        if (clickedScene) return clickedScene;
                    }
                }

                if (!_isChild) return; // return if this is root scene
                
                var localMouse = mousePos;
                if (scene.mParent)
                    localMouse = scene.mParent.wcToLocal(localMouse);
                
                // make mouse position relative to pivot
                localMouse[0] -= scene.getXform().getPivot()[0];
                localMouse[0] -= scene.getXform().getXPos();
                localMouse[1] -= scene.getXform().getPivot()[1];
                localMouse[1] -= scene.getXform().getYPos();
                
                var dist = Math.sqrt(localMouse[0]*localMouse[0] + localMouse[1]*localMouse[1]);
                    
                if(distAllowed >= dist)
                    return scene;
                
                return null; // no scene clicked
            }
        }
    };
  
    $scope.onMouseMove = function (event){
        // TODO: fix bug where mouse position is off if 
        //       the page is reloaded while scrolled down

        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mCameras[0].mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mCameras[0].mouseWCY(canvasY);
        var pos = [$scope.mLastWCPosX, $scope.mLastWCPosY];

        // mouse position square
        $scope.mMyWorld.mXfSq.getXform().setPosition(pos[0], pos[1]);
        
        // TODO: remove this kelvin code and GUI mosue over
        //$scope.mMyWorld.detectMouseOver($scope.mLastWCPosX, $scope.mLastWCPosY, (event.which===1));
        
        // scene handle code
        if (event.which === 1 && $scope.handleMode && $scope.currScene) {
            
            var currSceneForm = $scope.currScene.getXform();
            // convert mouse position to parent's local coords 
            
            //update item info UI
            
            
            

        
            if ($scope.currScene.mParent)
                pos = $scope.currScene.mParent.wcToLocal(pos);

            // make mouse position relative to pivot
            pos[0] -= $scope.currScene.getXform().getPivot()[0];
            pos[0] -= $scope.currScene.getXform().getXPos();
            pos[1] -= $scope.currScene.getXform().getPivot()[1];
            pos[1] -= $scope.currScene.getXform().getYPos();

            if ($scope.handleMode === "Translate") {
                // assign position to mouse coords offset from pivot
                pos[0] += $scope.currScene.getXform().getXPos();
                pos[1] += $scope.currScene.getXform().getYPos();
                currSceneForm.setPosition(pos[0], pos[1]);
                
                var itemRoomCoords = $scope.currScene.wcToRoomScale([currSceneForm.getXPos(), currSceneForm.getYPos()]);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
                
            
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
                
                $scope.mItemXDim = Math.abs(currSceneForm.getWidth().toFixed(2));
                $scope.mItemYDim = Math.abs(currSceneForm.getHeight().toFixed(2));

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