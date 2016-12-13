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

    $scope.currSelection = null;
    $scope.mMyTransHandle = new TransformHandle($scope.mMyWorld.mShader, $scope.currSelection);
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
        $scope.mMyTransHandle.draw($scope.mCameras[0]);

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
        // TODO: fix bug where mouse position is off if 
        //       the page is reloaded while scrolled down
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
        
        var wcPos = [0, 0];
        $scope.mLastWCPosX = wcPos[0] = $scope.useCam.mouseWCX($scope.mCanvasX);
        $scope.mLastWCPosY = wcPos[1] = $scope.useCam.mouseWCY($scope.mCanvasY);

        // console.log("test", $scope.mLastWCPosX, $scope.mLastWCPosY, wcPos)

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
        
        $scope.mMyWorld.mRoom.addFurniture(item);
    };
    
    
    /*
    $scope.changeSceneWidth = function(){
        if($scope.currSelection){
            var newWidth = document.getElementById('xDimension').value;
            $scope.currSelection.getXform().setSize(newWidth, $scope.currSelection.getXform().getHeight());
            $scope.mItemXDim = newWidth;
        }
    };
    $scope.changeSceneLength = function(){
        if($scope.currSelection){
            var newLength = document.getElementById('yDimension').value;
            $scope.currSelection.getXform().setSize($scope.currSelection.getXform().getWidth(), newLength);
            $scope.mItemYDim = newLength;
        }
    };
    $scope.changeSceneX = function() {
        if($scope.currSelection){
            var newX = document.getElementById('xPos').value;           //value the user entered (X)
            var sceneForm = $scope.currSelection.getXform();        //xform
            //new room coordinates
            sceneForm.setPosition(newX, sceneForm.getYPos());    
            
        }
    };
   
    $scope.changeSceneX = function() {
        
    };
    
    */
    //Fine tuners call these functions for making small adjustments to items
    $scope.incrXDim = function(){ 
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            if(sceneForm.getWidth() >= 0)
                sceneForm.setSize(sceneForm.getWidth() + 0.01, sceneForm.getHeight());
            else
                sceneForm.setSize(sceneForm.getWidth() - 0.01, sceneForm.getHeight());
            $scope.mItemXDim = Math.abs((sceneForm.getWidth()).toFixed(2));
        }
    };
    $scope.incrYDim = function(){
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            if(sceneForm.getHeight() >= 0)
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() + 0.01);
            else
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() - 0.01);
            $scope.mItemYDim = Math.abs((sceneForm.getHeight()).toFixed(2));
        }
    };
    $scope.decXDim = function(){
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            if(sceneForm.getWidth() >= 0)
                sceneForm.setSize(sceneForm.getWidth() - 0.01, sceneForm.getHeight());
            else
                sceneForm.setSize(sceneForm.getWidth() + 0.01, sceneForm.getHeight());
            $scope.mItemXDim = Math.abs((sceneForm.getWidth()).toFixed(2));
        }
    
        
    };
    $scope.decYDim = function(){
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            if(sceneForm.getHeight() >= 0)
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() - 0.01);
            else
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() + 0.01);
            $scope.mItemYDim = (sceneForm.getHeight()).toFixed(2);
        }
        
    };
    $scope.incrXPos = function(){
          if($scope.currSelection){
                var itemRoomCoords = $scope.currSelection.wcToRoomScale([$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos()+0.01, $scope.currSelection.getXform().getYPos());
                $scope.mItemXPos = (itemRoomCoords[0]+0.01).toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
    };
    $scope.incrYPos = function(){
        if($scope.currSelection){
                var itemRoomCoords = $scope.currSelection.wcToRoomScale([$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()+0.01);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = (itemRoomCoords[1]+0.01).toFixed(2);
            }
    };
    $scope.decXPos = function(){
        if($scope.currSelection){
                var itemRoomCoords = $scope.currSelection.wcToRoomScale([$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos()-0.01, $scope.currSelection.getXform().getYPos());
                $scope.mItemXPos = (itemRoomCoords[0]-0.01).toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
    };
    $scope.decYPos = function(){
        if($scope.currSelection){
                var itemRoomCoords = $scope.currSelection.wcToRoomScale([$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()-0.01);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = (itemRoomCoords[1]-0.01).toFixed(2);
            }
    };

    // delete furniture item
    $scope.deleteItem = function () {
        if ($scope.currSelection && $scope.currSelection.mParent)
            $scope.currSelection.mParent.removeChild($scope.currSelection);

        $scope.mMyTransHandle.setTransformable(null);
        $scope.currSelection = null;
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
            $scope.computeWCPos(event); // convert mouse position    
            var x = $scope.mLastWCPosX;
            var y = $scope.mLastWCPosY;
            var dist = 0.4;

            //check if user is selecting a new view
            $scope.checkViewSelection($scope.mCanvasX, $scope.mCanvasY); 
            
            // scene handle code
            if ($scope.mMyTransHandle.mouseInTransHandle(x, y, dist))
                $scope.handleMode = "Translate";
            else if ($scope.mMyTransHandle.mouseInRotHandle(x, y, dist))
                $scope.handleMode = "Rotation";
            else if ($scope.mMyTransHandle.mouseInScaleHandle(x, y, dist))
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
            
            $scope.currSelection = newScene;
            $scope.mMyTransHandle.setTransformable(newScene);
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
        var lastPos = [$scope.mLastWCPosX, $scope.mLastWCPosY];
        var pos = $scope.computeWCPos(event);
        var relPos;

        // mouse position square
        $scope.mMyWorld.mXfSq.getXform().setPosition(pos[0], pos[1]);
        
        // scene handle code
        if (event.which === 1 && $scope.handleMode && $scope.currSelection) {
            var currSelectionForm = $scope.currSelection.getXform();

            // convert mouse position to parent's local coords 
            if ($scope.currSelection.mParent)
                relPos = $scope.currSelection.mParent.wcToLocal(pos);

            // make mouse position relative to pivot
            relPos[0] -= $scope.currSelection.getXform().getPivot()[0];
            relPos[0] -= $scope.currSelection.getXform().getXPos();
            relPos[1] -= $scope.currSelection.getXform().getPivot()[1];
            relPos[1] -= $scope.currSelection.getXform().getYPos();

            if ($scope.handleMode === "Translate") {
                // assign position to mouse coords offset from pivot
                relPos[0] += $scope.currSelection.getXform().getXPos();
                relPos[1] += $scope.currSelection.getXform().getYPos();
                currSelectionForm.setPosition(relPos[0], relPos[1]);
                
                var itemRoomCoords = $scope.currSelection.wcToRoomScale([currSelectionForm.getXPos(), currSelectionForm.getYPos()]);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);

                // TOOD: clamp position to whichever room the mouse is in (last in if on wall)
            }
            else if ($scope.handleMode === "Rotation") {
                // TODO: figure out why this doesn't work when parent is scaled
                // // calculate mouse position angle to pivot
                // var rot = Math.PI/2 - Math.atan2(relPos[0],relPos[1]);
                // currSelectionForm.setRotationInRad(rot);

                // TODO: and why this does work
                var relPos = [ // mouse position relative to scene handle center
                    $scope.mLastWCPosX - $scope.mMyTransHandle.getXform().getXPos(),
                    $scope.mLastWCPosY - $scope.mMyTransHandle.getXform().getYPos()
                ];

                var rot = Math.PI/2 - Math.atan2(relPos[0],relPos[1]);
                if ($scope.currSelection.mParent) 
                    rot -= $scope.currSelection.mParent.getWCRotation();
                currSelectionForm.setRotationInRad(rot);
            }
            else if ($scope.handleMode === "Scale") {
                // TODO: figure out why this doesn't work when scene rotated
                // currSelectionForm.setSize(relPos[0]+1,relPos[1]);

                // TODO: and why this does work
                var relPos = [ // mouse position relative to scene handle center
                    pos[0] - lastPos[0],
                    pos[1] - lastPos[1]
                    // $scope.mLastWCPosX - $scope.mMyTransHandle.getXform().getXPos(),
                    // $scope.mLastWCPosY - $scope.mMyTransHandle.getXform().getYPos()
                ];

                var rotMat = mat4.create(); // reverse the scene's rotation
                mat4.rotateZ(rotMat, rotMat, -$scope.mMyTransHandle.getXform().getRotationInRad());
                var relPosWC = vec2.transformMat4(vec2.create(), relPos, rotMat);

                // TODO: clamp scale 

                currSelectionForm.setSize(currSelectionForm.getWidth() + relPosWC[0]*2, currSelectionForm.getHeight() + relPosWC[1]);

                $scope.mItemXDim = Math.abs(currSelectionForm.getWidth().toFixed(2));
                $scope.mItemYDim = Math.abs(currSelectionForm.getHeight().toFixed(2));
            }
        }
        else $scope.handleMode = null;
    };
});