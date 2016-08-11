import React, {Component} from 'react'
// import CONSTANTS from '../../../config/constants'

var Drawing = {
    canvas: null,
    ctx: null,
    color: null,
    size: {},
    fontSize: null,
    lineWidth:{},
    cStep: -1,
    cPushArray: [],
    cPush: function(){
        var self = this;
        this.cStep++;

        if(this.cStep < this.cPushArray.length) {
            // remove some elements 
            this.cPushArray.length = this.cStep;
        }

        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob) {
                var objectUrl = URL.createObjectURL(blob);
                self.cPushArray.push(objectUrl);
            })
        }
    },
    cUndo: function() {
        var self = this;
        if(this.cStep>0) {
            this.cStep--;
            var img = new Image;
            img.onload = function () {
                self.clearCanvas();
                self.ctx.drawImage(img, 0, 0);
            }
            img.src= this.cPushArray[this.cStep];
        }
    },
    cRedo: function() {
        var self = this;
        if(this.cStep<this.cPushArray.length-1) {
            this.cStep++;
            var img=new Image();
            img.onload=function() {
                self.clearCanvas();
                self.ctx.drawImage(img, 0, 0);
            }
            img.src=this.cPushArray[this.cStep];
        }
    },
    draw: function(lX, lY, cX, cY) {
        this.ctx.lineCap = "round";
        this.ctx.fillStyle = "solid";
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth.width;
        this.ctx.moveTo(lX,lY);
        this.ctx.lineTo(cX,cY);
        this.ctx.stroke();
    },
    drawText: function(currentX, currentY) {
        this.ctx.fillStyle = this.color  //this.color;
        this.ctx.font = this.fontSize.size +"px Arial"; // this.fontSize.size+"px Arial";
        this.ctx.fillText(this.cText, currentX, currentY);
    },
    clearCanvas: function() {
        //Store the current transformation matrix
        this.ctx.save();
        //Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Restore the transform
        this.ctx.restore();
    },
}

export default Drawing