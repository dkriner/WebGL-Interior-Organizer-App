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

    window.$scope = $scope;

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
//   $scope.mRoomX = 0.0;
//    $scope.mRoomY = 0.0;
    $scope.mCameras = [];
    $scope.mRoomBorderSelection = "Floor+Ceiling";
    
    // this is the model
    $scope.mMyWorld = new World();

    $scope.currSelection = null;
    $scope.mCurrentRoom = $scope.mMyWorld.mRooms[0];
    $scope.mMyTransHandle = new TransformHandle($scope.mMyWorld.mShader, $scope.currSelection);
    // $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    //$scope.mSelectedEcho = $scope.eSelection[0].label;

    $scope.mHandleMode = null;
    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;
    $scope.inViewPort = false;
//    var roomSize = $scope.mCurrentRoom.getSize();
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
        if (!$scope.inViewPort)
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
        $scope.mCurrentRoom = newRoom;
        $scope.mMyWorld.mHouse.addAsChild(newRoom);
        $scope.currSelection = newRoom;
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
 
            house.removeChild($scope.mCurrentRoom); // delete from house
            
            // TODO: don't require active room
            $scope.mCurrentRoom = rooms[rooms.length -1] // update current room
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
        item.getXform().setSize(3, 3*ratio);
        
        $scope.mCurrentRoom.addFurniture(item);
        $scope.currSelection = item;
    };
    

    //Fine tuners call these functions for making small adjustments to items
    $scope.changeItemDim = function(xStep, yStep){
        if($scope.currSelection){
            var sceneForm = $scope.currSelection.getXform();
            
            if(sceneForm.getWidth() >= 0 && xStep !== 0)
                sceneForm.setSize(sceneForm.getWidth() + xStep, sceneForm.getHeight());
            else
                sceneForm.setSize(sceneForm.getWidth() - xStep, sceneForm.getHeight());
            
            if(sceneForm.getHeight() >= 0 && yStep !==0)
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() + yStep);
            else
                sceneForm.setSize(sceneForm.getWidth(), sceneForm.getHeight() - yStep);
            
            
            $scope.mItemYDim = Math.abs((sceneForm.getHeight()).toFixed(2));
            $scope.mItemXDim = Math.abs((sceneForm.getWidth()).toFixed(2));
            
        }
    };
    
    
    
    $scope.changeXPos = function(xStep, yStep){
        if($scope.currSelection){
                var roomSize = $scope.mCurrentRoom.getSize();
                var currXform = $scope.currSelection.getXform();
                
                if(xStep !== 0)
                    currXform.setPosition(currXform.getXPos() + xStep, currXform.getYPos());
                
                if(yStep !== 0)
                    currXform.setPosition(currXform.getXPos(), currXform.getYPos() + yStep);

                
                $scope.mItemXPos = (currXform.getXPos() + roomSize[0]/2).toFixed(2);
                $scope.mItemYPos = (currXform.getYPos() + roomSize[1]/2).toFixed(2);
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
            var currXform = $scope.currSelection.getXform();
            var x = parseFloat(document.getElementById('xPos').value, 10);
            var y = parseFloat(document.getElementById('yPos').value, 10);
            var roomSize = $scope.mCurrentRoom.getSize();

            
                currXform.setPosition(x - roomSize[0]/2, currXform.getYPos());

            
                currXform.setPosition(currXform.getXPos(), y - roomSize[1]/2);

        }
    };
    
    $scope.resizeRoom = function(xStep, yStep){
        
        var room = $scope.mCurrentRoom;
        var roomSize = room.getSize();
        
        if(xStep !== 0)
            room.setSize(roomSize[0] + xStep, roomSize[1]);
        
        if(yStep !== 0)
            room.setSize(roomSize[0], roomSize[1] + yStep);
        
        roomSize = room.getSize();
        room.mRoomX = roomSize[0].toFixed(2);
        room.mRoomY = roomSize[1].toFixed(2);
        
        
        $scope.mItemXPos = ($scope.currSelection.getXform().getXPos() + roomSize[0]/2).toFixed(2);
        $scope.mItemYPos = ($scope.currSelection.getXform().getYPos() + roomSize[1]/2).toFixed(2);
  
    };
    $scope.customResizeRoom = function(){
        var x = parseFloat(document.getElementById('customRoomX').value, 10);
        var y = parseFloat(document.getElementById('customRoomY').value, 10);
        var room = $scope.mCurrentRoom;

        var roomSize = room.getSize();
        
        if(x)
            room.setSize(x, roomSize[1]);
        
        roomSize = room.getSize();
        
        if(y)
            room.setSize(roomSize[0], y);
        
        
        $scope.mItemXPos = ($scope.currSelection.getXform().getXPos() + roomSize[0]/2).toFixed(2);
        $scope.mItemYPos = ($scope.currSelection.getXform().getYPos() + roomSize[1]/2).toFixed(2);
  
    };

    // delete furniture item or room
    $scope.deleteItem = function () {
        if ($scope.currSelection && $scope.currSelection.mParent) {
            if ($scope.currSelection instanceof SceneNode)
                $scope.currSelection.mParent.removeChild($scope.currSelection);
            else $scope.currSelection.mParent.removeFromSet($scope.currSelection);
        }

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
            $scope.mCurrentRoom.setFloorPattern(texture);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    $scope.setFloorDesignScale = function () {
        $scope.mCurrentRoom.setFloorPatternScale($scope.floorDesignScale);
    };
    
    $scope.checkViewSelection = function(canvasX, canvasY, type)
    {
        if ($scope.mCameras[1].isMouseInViewport(canvasX, canvasY))
        {
            if (type==="Down")$scope.drawBorderTo ($scope.mCameraNames[1], false);
            return true;
        }
        else if($scope.mCameras[2].isMouseInViewport(canvasX, canvasY))
        {
            if (type==="Down")$scope.drawBorderTo ($scope.mCameraNames[2], true);
            return true;
        }
        else if ($scope.mCameras[3].isMouseInViewport(canvasX, canvasY))
        {
            if (type==="Down")$scope.drawBorderTo($scope.mCameraNames[3], true);
            return true;
        }
        
        return false;
    };

    $scope.drawBorderTo = function(camera, drawCeiling)
    {
        $scope.mRoomBorderSelection = camera;
        $scope.mDrawCeiling = drawCeiling;
    };

    $scope.onMouseDown = function (event){
        if (event.which === 1) { // left     
            $scope.computeWCPos(event); // convert mouse position    
            var x = $scope.mLastWCPosX;
            var y = $scope.mLastWCPosY;
            var dist = 0.4;

            //check if user is selecting a new view
            $scope.inViewPort = $scope.checkViewSelection($scope.mCanvasX, $scope.mCanvasY, "Down"); 
            
            if (!$scope.inViewPort)
            {
                // xform handle code
                if ($scope.mMyTransHandle.mouseInTransHandle(x, y, dist))
                    return $scope.handleMode = "Translate";
                else if ($scope.mMyTransHandle.mouseInRotHandle(x, y, dist))
                    return $scope.handleMode = "Rotation";
                else if ($scope.mMyTransHandle.mouseInScaleHandle(x, y, dist))
                    return $scope.handleMode = "Scale";
                else $scope.handleMode = null;

                // room activation code
                var clickedRoom = $scope.mMyWorld.mHouse.matchDescendant([x,y]);
                while (clickedRoom && !(clickedRoom instanceof Room)) 
                    clickedRoom = clickedRoom.mParent;
                $scope.mCurrentRoom = clickedRoom || $scope.mCurrentRoom;

                // furniture / room selection code            
                var clickedItem = null;
                if ($scope.mDrawCeiling) clickedItem = $scope.mCurrentRoom.ceiling.matchDescendant([x,y]);
                if (!clickedItem) clickedItem = $scope.mCurrentRoom.floor.matchDescendant([x,y]);
                if (!clickedItem) clickedItem = clickedRoom;
                if (clickedItem){
                    $scope.mItemXDim = clickedItem.getXform().getWidth().toFixed(2);
                    $scope.mItemYDim = clickedItem.getXform().getHeight().toFixed(2);


                    var roomSize = $scope.mCurrentRoom.getSize();
                    $scope.mItemXPos = (clickedItem.getXform().getXPos() + roomSize[0]/2).toFixed(2);
                    $scope.mItemYPos = (clickedItem.getXform().getYPos() + roomSize[1]/2).toFixed(2);

                }
                $scope.currSelection = clickedItem;
            }
        }
    };
  
    $scope.onMouseMove = function (event){
        var lastPos = [$scope.mLastWCPosX, $scope.mLastWCPosY];
        var relPos, pos = $scope.computeWCPos(event);

        //if($scope.currSelection){
            //var itemPos = [$scope.currSelection.getXform().getXPos(), $scope.currSelection.getXform().getYPos()];
            //itemPos = $scope.currSelection.localToWC(itemPos);
            //console.log("WC X: " + itemPos[0] + " Y: " + itemPos[1]);
        //}

        // determine if mouse is in a viewport or large view
        $scope.inViewPort = $scope.checkViewSelection($scope.mCanvasX, $scope.mCanvasY, "Move"); 
        
        // mouse position square
        $scope.mMyWorld.mXfSq.getXform().setPosition(pos[0], pos[1]);
        
        // scene handle code
        if (event.which === 1 && $scope.handleMode && $scope.currSelection) {
            var currSelectionForm = $scope.currSelection.getXform();

            if ($scope.handleMode === "Translate") {
                // relocation to another room handling
                if (!($scope.currSelection instanceof Room)) {
                    var hoverRoom = $scope.mMyWorld.mHouse.matchChild(pos);
                    if (hoverRoom && hoverRoom !== $scope.mCurrentRoom) {
                        $scope.mCurrentRoom.removeFurniture($scope.currSelection);
                        hoverRoom.addFurniture($scope.currSelection);
                        $scope.mCurrentRoom = hoverRoom;
                    }
                }

                // convert mouse position to parent's local coords 
                if ($scope.currSelection.mParent)
                    relPos = $scope.currSelection.mParent.wcToLocal(pos);
                // assign position to mouse coords offset from pivot
                relPos[0] -= $scope.currSelection.getXform().getPivot()[0];
                relPos[1] -= $scope.currSelection.getXform().getPivot()[1];
                currSelectionForm.setPosition(relPos[0], relPos[1]);
                

                var roomSize = $scope.mCurrentRoom.getSize();
                $scope.mItemXPos = ($scope.currSelection.getXform().getXPos() + roomSize[0]/2).toFixed(2);
                $scope.mItemYPos = ($scope.currSelection.getXform().getYPos() + roomSize[1]/2).toFixed(2);


                // TOOD: clamp position to whichever room the mouse is in (last in if on wall)
            }
            else if ($scope.handleMode === "Rotation") {
                // TODO: figure out why this doesn't work when parent is scaled
                // // calculate mouse position angle to pivot
                // var rot = Math.PI/2 - Math.atan2(relPos[0],relPos[1]);
                // currSelectionForm.setRotationInRad(rot);

                // TODO: and why this does work
                relPos = [ // mouse position relative to scene handle center
                    $scope.mLastWCPosX - $scope.mMyTransHandle.getXform().getXPos(),
                    $scope.mLastWCPosY - $scope.mMyTransHandle.getXform().getYPos()
                ];

                var rot = Math.PI/2 - Math.atan2(relPos[0],relPos[1]);
                if ($scope.currSelection.mParent) 
                    rot -= $scope.currSelection.mParent.getWCRotation();
                // constrain room rotation to remain on axis
                if ($scope.currSelection instanceof Room)
                    rot = Math.PI/2 * Math.round(rot / (Math.PI/2));
                currSelectionForm.setRotationInRad(rot);
            }
            else if ($scope.handleMode === "Scale") {
                // TODO: figure out why this doesn't work when scene rotated
                // currSelectionForm.setSize(relPos[0]+1,relPos[1]);

                // TODO: and why this does work
                relPos = [
                    pos[0] - lastPos[0],
                    pos[1] - lastPos[1]
                ];

                var rotMat = mat4.create(); // reverse the scene's rotation
                mat4.rotateZ(rotMat, rotMat, -$scope.mMyTransHandle.getXform().getRotationInRad());
                var relPosWC = vec2.transformMat4(vec2.create(), relPos, rotMat);

                // TODO: clamp scale 
                if ($scope.currSelection instanceof Room) {
                    var size = $scope.currSelection.getSize();
                    $scope.currSelection.setSize(size[0] + relPosWC[0]*2, size[1] + relPosWC[1]*2);
                    
                    var room = $scope.currSelection;
                    room.mRoomX = size[0].toFixed(2);
                    room.mRoomY = size[1].toFixed(2);
                }
                else currSelectionForm.setSize(currSelectionForm.getWidth() + relPosWC[0]*2, currSelectionForm.getHeight() + relPosWC[1]);

                $scope.mItemXDim = Math.abs(currSelectionForm.getWidth().toFixed(2));
                $scope.mItemYDim = Math.abs(currSelectionForm.getHeight().toFixed(2));
            }
        }
        else $scope.handleMode = null;
    };

    $scope.$watch('currSelection', function(newVal){
        $scope.mMyTransHandle.setTransformable(newVal);
    });
});