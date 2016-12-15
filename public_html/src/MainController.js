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
//    $scope.mRoomX = 0.0;
//    $scope.mRoomY = 0.0;
    $scope.mCameras = [];
    $scope.mRoomBorderSelection = "Floor+Ceiling";
    
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
//    var roomSize = $scope.mMyWorld.mCurrentRoom.getSize();
//    $scope.mRoomX = roomSize[0];
//    $scope.mRoomY = roomSize[1];
    

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
        else if (cam.mName === $scope.mCameraNames[3])
            i = 3;
                
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
        else if (cam.mName === $scope.mCameraNames[3])
            i = 3;
        
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
        else if (cam.mName === $scope.mCameraNames[3])
            i = 3;
        
        for (var j=0; j<4; j++)
            viewPort[i] = parseInt($scope.mViewPorts[i][j]);
    };

    $scope.mCameraNames = ["Large", "Floor", "Floor+Ceiling", "House"];
    $scope.mRoomBorderSelection = $scope.mCameraNames[2];
    $scope.mWCWidths = [15, 15, 15, 15];
    $scope.mWCCenters = [[0, 3], 
                         [0, 3], 
                         [0, 3],
                         [0, 3]

                        ];
    $scope.mViewPorts = [[0, 0, 800, 600],
                         [800, 250, 200, 155], 
                         [800, 425, 200, 155],
                         [800, 75, 200, 155]

                        ];

    // Create 4 cameras
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

    // Floor (small viewport)
    $scope.floorSquareArea = new SquareArea($scope.mCameras[1]);
    $scope.floorSquareArea.setColor([0,1,0,1]);

    // Floor+Ceiling (small viewport)
    $scope.floorCeilingSquareArea = new SquareArea($scope.mCameras[2]);
    $scope.floorCeilingSquareArea.setColor([0,1,0,1]);

    // House (small viewport)
    $scope.houseSquareArea = new SquareArea($scope.mCameras[3]);
    $scope.houseSquareArea.setColor([0,1,0,1]);

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
        $scope.floorCeilingSquareArea.draw($scope.mCameras[2], $scope.mMyWorld, 
                                           $scope.mCameraNames[2], $scope.mRoomBorderSelection, true);
        //$scope.floorCeilingSquareArea.draw($scope.mCameras[2]);
        
        // ********************************************
        //              draw small floor 
        // ********************************************
        //$scope.mMyWorld.draw($scope.mCameras[1]);
        $scope.floorSquareArea.draw($scope.mCameras[1], $scope.mMyWorld, 
                                    $scope.mCameraNames[1], $scope.mRoomBorderSelection, false);
        
        // ********************************************
        //                draw house
        // ********************************************
        //$scope.mMyWorld.draw($scope.mCameras[3]);
        $scope.houseSquareArea.draw($scope.mCameras[3], $scope.mMyWorld, 
                                    $scope.mCameraNames[3], $scope.mRoomBorderSelection, false);
    };

    $scope.computeWCPos = function (event){
        // TODO: fix bug where mouse position is off if 
        //       the page is reloaded while scrolled down
        $scope.mClientX = event.clientX;
        $scope.mClientY = event.clientY;
        $scope.mCanvasX = $scope.mCanvasMouse.getPixelXPos(event);
        $scope.mCanvasY = $scope.mCanvasMouse.getPixelYPos(event);
 
        $scope.useCam = $scope.mCameras[0]; // assume using this camera
        $scope.mWhichCamera = $scope.mCameraNames[0];
        
        if ($scope.mCameras[1].isMouseInViewport($scope.mCanvasX, $scope.mCanvasY)) {
            $scope.useCam = $scope.mCameras[1];
            $scope.mWhichCamera = $scope.mCameraNames[1];
        }
        else if ($scope.mCameras[2].isMouseInViewport($scope.mCanvasX, $scope.mCanvasY)) {
            $scope.useCam = $scope.mCameras[2];
            $scope.mWhichCamera = $scope.mCameraNames[2]; 
        }
        else if ($scope.mCameras[3].isMouseInViewport($scope.mCanvasX, $scope.mCanvasY)) {
            $scope.useCam = $scope.mCameras[3];
            $scope.mWhichCamera = $scope.mCameraNames[3];
        }
        
        // these are "private functions" on the camera, 
        // for the purpose of clear illustration, we will call them
        $scope.mViewportX = $scope.useCam._viewportX($scope.mCanvasX);
        $scope.mViewportY = $scope.useCam._viewportY($scope.mCanvasY);
        
        var wcPos = [0, 0];
        $scope.mLastWCPosX = wcPos[0] = $scope.useCam.mouseWCX($scope.mCanvasX);
        $scope.mLastWCPosY = wcPos[1] = $scope.useCam.mouseWCY($scope.mCanvasY);

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
    
    // add room
    $scope.addRoom = function () 
    {
        var numRooms = $scope.mMyWorld.mRooms.length + 1;
        var roomName = "Room " + numRooms;
        
        var newRoom = new Room($scope.mMyWorld.mShader, roomName, 0, 3, 12, 8);  
        $scope.mMyWorld.mCurrentRoom = newRoom;
        $scope.mMyWorld.mHouse.addAsChild(newRoom);
    };
    
    // delete room
    $scope.deleteRoom = function () 
    {
        // TODO: determine how the user knows which room is being deleted
        // for now, it will delete the last created room
        if ($scope.mMyWorld.mRooms.length > 1)  // ensure user doesn't delete all rooms
        {
            var rooms = $scope.mMyWorld.mRooms;
            var house = $scope.mMyWorld.mHouse;
 
            house.removeChild($scope.mMyWorld.mCurrentRoom); // delete from house
            
            // TODO: don't require active room
            $scope.mMyWorld.mCurrentRoom = rooms[rooms.length -1] // update current room
        }
    };
    
    
    // add furniture item
    $scope.addFurniture = function (selection) {
        var item = new SquareRenderable($scope.mMyWorld.mShader);
        var texImg = $scope.mMyWorld.textures[selection].image;
        var ratio = texImg.naturalHeight / texImg.naturalWidth;
        item.setTexture($scope.mMyWorld.textures[selection]);
        item.setName(selection);
        // TODO: set size relative to real world units
        item.getXform().setSize(3, 3 * ratio);
        
        $scope.mMyWorld.mCurrentRoom.addFurniture(item);
    };
    

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
                var itemPos = [$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()];
                var itemRoomCoords = $scope.currSelection.wcToRoomScale(itemPos, [-6,6], [0,$scope.mMyWorld.mCurrentRoom.mRoomX], [-4,4], [0,$scope.mMyWorld.mCurrentRoom.mRoomY]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos()+0.01, $scope.currSelection.getXform().getYPos());
                $scope.mItemXPos = (itemRoomCoords[0]+0.01).toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
    };
    $scope.incrYPos = function(){
        if($scope.currSelection){
                var itemPos = [$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()];
                var itemRoomCoords = $scope.currSelection.wcToRoomScale(itemPos, [-6,6], [0,$scope.mMyWorld.mCurrentRoom.mRoomX], [-4,4], [0,$scope.mMyWorld.mCurrentRoom.mRoomY]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()+0.01);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = (itemRoomCoords[1]+0.01).toFixed(2);
            }
    };
    $scope.decXPos = function(){
        if($scope.currSelection){
                var itemPos = [$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()];
                var itemRoomCoords = $scope.currSelection.wcToRoomScale(itemPos, [-6,6], [0,$scope.mMyWorld.mCurrentRoom.mRoomX], [-4,4], [0,$scope.mMyWorld.mCurrentRoom.mRoomY]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos()-0.01, $scope.currSelection.getXform().getYPos());
                $scope.mItemXPos = (itemRoomCoords[0]-0.01).toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
    };
    $scope.decYPos = function(){
        if($scope.currSelection){
                var itemPos = [$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()];
                var itemRoomCoords = $scope.currSelection.wcToRoomScale(itemPos, [-6,6], [0,$scope.mMyWorld.mCurrentRoom.mRoomX], [-4,4], [0,$scope.mMyWorld.mCurrentRoom.mRoomY]);
                
                $scope.currSelection.getXform().setPosition($scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()-0.01);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = (itemRoomCoords[1]-0.01).toFixed(2);
            }
    };
    
    $scope.customResizeItem = function() {
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            var sceneSize = [sceneForm.getWidth(), sceneForm.getHeight()];
            var width = parseFloat(document.getElementById('xDimension').value, 10);
            var height = parseFloat(document.getElementById('yDimension').value, 10);
      
            
            if(width)
                sceneForm.setSize(width, sceneSize[1]);
            
            var sceneSize = [sceneForm.getWidth(), sceneForm.getHeight()];
            
            if(height)
                sceneForm.setSize(sceneSize[0], height);
        }
       
    };
    
    $scope.customMoveItem = function() {
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            var scenePos = [sceneForm.getXPos(), sceneForm.getYPos()];
            var x = parseFloat(document.getElementById('xPos').value, 10);
            var y = parseFloat(document.getElementById('yPos').value, 10);
           
            
            if(x){
                scenePos = $scope.currSelection.wcToRoomScale(scenePos, [-6,6], [0,$scope.mMyWorld.mCurrentRoom.mRoomX], [-4,4], [0,$scope.mMyWorld.mCurrentRoom.mRoomY]);
                sceneForm.setPosition(x, scenePos[1]);
            }
            
            //var scenePos = [sceneForm.getXPos(), sceneForm.getYPos()];
            
            if(y){
                sceneForm.setPosition(scenePos[0], y);
            }
        }
    };
    
    $scope.resizeRoom = function(xStep, yStep){
        
        var room = $scope.mMyWorld.mCurrentRoom;
        var roomSize = room.getSize();
        
        if(xStep !== 0)
            room.setSize(roomSize[0] + xStep, roomSize[1]);
        
        if(yStep !== 0)
            room.setSize(roomSize[0], roomSize[1] + yStep);
        
        roomSize = room.getSize();
        room.mRoomX = roomSize[0].toFixed(2);
        room.mRoomY = roomSize[1].toFixed(2);
  
    };
    $scope.customResizeRoom = function(){
        var x = parseFloat(document.getElementById('customRoomX').value, 10);
        var y = parseFloat(document.getElementById('customRoomY').value, 10);
        var room = $scope.mMyWorld.mCurrentRoom;

        var roomSize = room.getSize();
        
        if(x)
            room.setSize(x, roomSize[1]);
        
        roomSize = room.getSize();
        
        if(y)
            room.setSize(roomSize[0], y);
  
    };

    // delete furniture item or room
    $scope.deleteItem = function () {
        if ($scope.currSelection && $scope.currSelection.mParent) {
            if ($scope.currSelection instanceof SceneNode)
                $scope.currSelection.mParent.removeChild($scope.currSelection);
            else $scope.currSelection.mParent.removeFromSet($scope.currSelection);
        }

        $scope.mMyTransHandle.setTransformable(null);
        $scope.currSelection = null;
        $scope.mItemXDim = 0.0;
        $scope.mItemYDim = 0.0;
        $scope.mItemXPos = 0.0;
        $scope.mItemYPos = 0.0;
    };

    $scope.bringForward = function () {
        var selection = $scope.currSelection
        if (!selection || !selection.mParent) return; // no selection or no parent

        if (selection instanceof SceneNode) {
            var index = selection.mParent.getIndexOfChild(selection);
            if (index >= selection.mParent.mChildren.length -1) return; // already top

            // swap with upper neighbor
            selection.mParent.mChildren[index] = selection.mParent.mChildren[index +1];
            selection.mParent.mChildren[index +1] = selection; 
        }
        else {
            var index = selection.mParent.getIndexOfItem(selection);
            if (index >= selection.mParent.mSet.length -1) return; // already top

            // swap with upper neighbor
            selection.mParent.mSet[index] = selection.mParent.mSet[index +1];
            selection.mParent.mSet[index +1] = selection; 
        }
    };

    $scope.sendBackward = function () {
        var selection = $scope.currSelection;
        if (!selection || !selection.mParent) return; // no selection or no parent

        if (selection instanceof SceneNode) {
            var index = selection.mParent.getIndexOfChild(selection);
            if (index <= 0) return; // already bottom

            // swap with upper neighbor
            selection.mParent.mChildren[index] = selection.mParent.mChildren[index -1];
            selection.mParent.mChildren[index -1] = selection; 
        }
        else {
            var index = selection.mParent.getIndexOfItem(selection);
            if (index <= 0) return; // already bottom

            // swap with upper neighbor
            selection.mParent.mSet[index] = selection.mParent.mSet[index -1];
            selection.mParent.mSet[index -1] = selection; 
        }
    };
    
    $scope.changeColor = function () {
        //CHANGE THE COLOR (TINT) OF THE SELECTED FURNITURE ITEM
        
    };
    
    $scope.editTexture = function(selection) {
        //CHANGE TEXTURE OF SELECTED OBJECT
    };

    $scope.acceptTexFile = function (event) {
        var reader = new FileReader();
        reader.onload = function () {
            $scope.mMyImage = new Image();
            $scope.mMyImage.src = reader.result;
            var texture = new Texture(reader.result);
            $scope.mMyWorld.mCurrentRoom.setFloorPattern(texture);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    $scope.setFloorDesignScale = function () {
        $scope.mMyWorld.mCurrentRoom.setFloorPatternScale($scope.floorDesignScale);
    };
    
    $scope.checkViewSelection = function(canvasX, canvasY){
        if ($scope.mCameras[1].isMouseInViewport(canvasX, canvasY))
        {
            $scope.mRoomBorderSelection = $scope.mCameraNames[1];
            $scope.mDrawCeiling = false;
        }
        else if($scope.mCameras[2].isMouseInViewport(canvasX, canvasY))
        {
            $scope.mRoomBorderSelection = $scope.mCameraNames[2];
            $scope.mDrawCeiling = true;
        }
        else if ($scope.mCameras[3].isMouseInViewport(canvasX, canvasY))
        {
            $scope.mRoomBorderSelection = $scope.mCameraNames[3];
            $scope.mDrawCeiling = true;
        }
    };

    $scope.onMouseDown = function (event){
        if (event.which === 1) { // left     
            $scope.computeWCPos(event); // convert mouse position    
            var x = $scope.mLastWCPosX;
            var y = $scope.mLastWCPosY;
            var dist = 0.4;

            //check if user is selecting a new view
            $scope.checkViewSelection($scope.mCanvasX, $scope.mCanvasY); 
            
            // xform handle code
            if ($scope.mMyTransHandle.mouseInTransHandle(x, y, dist))
                return $scope.handleMode = "Translate";
            else if ($scope.mMyTransHandle.mouseInRotHandle(x, y, dist))
                return $scope.handleMode = "Rotation";
            else if ($scope.mMyTransHandle.mouseInScaleHandle(x, y, dist))
                return $scope.handleMode = "Scale";
            else $scope.handleMode = null;

            // room activation code
            $scope.mCurrentRoom = getClickedChild([x,y], $scope.mMyWorld.mHouse) || $scope.mCurrentRoom;
            
            // furniture / room selection code            
            var clickedItem = null;
            if ($scope.mDrawCeiling) clickedItem = getClickedChild([x,y], $scope.mMyWorld.mCurrentRoom.ceiling);
            if (!clickedItem) clickedItem = getClickedChild([x,y], $scope.mMyWorld.mCurrentRoom.floor);
            if (!clickedItem) clickedItem = getClickedChild([x,y], $scope.mMyWorld.mHouse);
            
            if (clickedItem){
                $scope.mItemXDim = clickedItem.getXform().getWidth();
                $scope.mItemYDim = clickedItem.getXform().getHeight();
                
                var itemRoomCoords = clickedItem.wcToRoomScale([clickedItem.getXform().getXPos(), clickedItem.getXform().getYPos()]);
                $scope.mItemXPos = itemRoomCoords[0].toFixed(2);
                $scope.mItemYPos = itemRoomCoords[1].toFixed(2);
            }
            
            $scope.currSelection = clickedItem;
            $scope.mMyTransHandle.setTransformable(clickedItem);
            //$scope.mSelectedXform = $scope.mMyWorld.topChildXform();
            
            // returns child in scene that was clicked or null
            function getClickedChild(mousePos, scene, _isChild){
                var children = (scene.mSet && scene.mSet.concat(scene.mChildren)) || [];
                for (var i = children.length - 1; i >= 0; i--){
                    var clickedScene = getClickedChild(mousePos, children[i], true);
                    if (clickedScene) return clickedScene;
                }

                // if (!_isChild) return null; // return if this is root scene
                // else 
                return scene.isClicked(mousePos)? scene : null;
            }
        }
    };
  
    $scope.onMouseMove = function (event){
        var lastPos = [$scope.mLastWCPosX, $scope.mLastWCPosY];
        var pos = $scope.computeWCPos(event);
        var relPos;

        //if($scope.currSelection){
            //var itemPos = [$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()];
            //itemPos = $scope.currSelection.localToWC(itemPos);
            //console.log("WC X: " + itemPos[0] + " Y: " + itemPos[1]);
        //}

        
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