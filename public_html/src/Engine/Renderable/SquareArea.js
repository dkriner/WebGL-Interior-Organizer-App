/*
    Author: John Fitzgerald, Griffin Howlet, Darren Kriner
    CSS450
    SquareArea.js
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function SquareArea(currView) 
{
    this.mConstColorShader = SimpleShader.getStaticShader();
    this.mCurrView = currView;
        
    // pivot red square
    this.mCenterPos = new SquareRenderable(this.mConstColorShader);
    this.mCenterPos.setColor([0, 0, 0, 1]);

    // initialize 4 border sides
    this.mBorders = [];
    for (var i=0; i<4; i++) 
    {
        var sq = new SquareRenderable(this.mConstColorShader);
        var xf = sq.getXform();
        sq.setColor([0, 1, 0, 1]);
        xf.setPosition(0,0);
        xf.setSize(10,10);
        this.mBorders.push(sq);
    }
};

SquareArea.prototype.setColor = function(color) 
{
    for (var i=0; i<this.mBorders.length; i++)
    {
        this.mBorders[i].setColor(color);
    }
};

SquareArea.prototype.initBorder = function(camera) 
{
    var currView = this.mCurrView;
    var xPos = currView.getWCCenter()[0];
    var yPos = currView.getWCCenter()[1];
    var wcWidth = currView.getWCWidth();
    var wcHeight = currView.getWCHeight();
    var sc = 20;

    var bWidth = camera.getWCWidth() / camera.getViewport()[2];

    // LEFT
    var xf = this.mBorders[0].getXform();
    xf.setPosition(xPos - (wcWidth/2) + (bWidth/2), yPos);
    xf.setSize(bWidth*sc, wcHeight*sc);

    // RIGHT
    var xf = this.mBorders[1].getXform();
    xf.setPosition(xPos + (wcWidth/2) - (bWidth/2), yPos);
    xf.setSize(bWidth*sc, wcHeight*sc);

    // UP
    var xf = this.mBorders[2].getXform();
    xf.setPosition(xPos, currView.getWCCenter()[1] + (wcHeight/2) - (bWidth/2));
    xf.setSize(wcWidth*sc, bWidth*sc);

    // DOWN
    var xf = this.mBorders[3].getXform();
    xf.setPosition(xPos, currView.getWCCenter()[1] - (wcHeight/2) + (bWidth/2));
    xf.setSize(wcWidth*sc, bWidth*sc);

    // PIVOT RED SQUARE
    this.mCenterPos.getXform().setSize(bWidth * 4, bWidth * 4);
    this.mCenterPos.getXform().setPosition(xPos, yPos);
};

SquareArea.prototype.draw = function (camera, world, cameraName, isSelectedName, drawCeiling) 
{
    camera.setupViewProjection();
    this.initBorder(camera);
    
    world.draw(camera, drawCeiling);
    
    if (cameraName === isSelectedName)
        for (var i=0; i<this.mBorders.length; i++)
            this.mBorders[i].draw(camera);
    
    // PIVOT RED SQUARE IN CENTRE
    //this.mCenterPos.draw(camera);
};
