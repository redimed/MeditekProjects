import React, {Component} from 'react'
// import CONSTANTS from '../../../config/constants'

class Drawing {
    constructor() {
        this.canvas = null
        this.ctx = null
        this.color = null
        this.size = {}
        this.fontSize = 15
        this.lineWidth = {}
        this.cStep = -1
        this.cPushArray = []
    }

    cReset(){
        this.cStep = -1
        this.cPushArray = []
    }

    cPush(){
        var self = this;
        this.cStep++;

        if(this.cStep < this.cPushArray.length) {
            this.cPushArray.length = this.cStep;
        }

        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob) {
                var objectUrl = URL.createObjectURL(blob);
                self.cPushArray.push(objectUrl);
            })
        }
    }


    cUndo() {
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
    }

    cRedo() {
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
    }

    draw(lX, lY, cX, cY) {
        this.ctx.lineCap = "round";
        this.ctx.fillStyle = "solid";
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth.width;
        this.ctx.moveTo(lX,lY);
        this.ctx.lineTo(cX,cY);
        this.ctx.stroke();
    }

    drawText(text, currentX, currentY) {
        this.ctx.fillStyle = this.color  //this.color;
        this.ctx.font = this.fontSize +"px Arial"; // this.fontSize.size+"px Arial";
        this.ctx.fillText(text, currentX, currentY);
    }

    clearCanvas() {
        //Store the current transformation matrix
        this.ctx.save();
        //Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Restore the transform
        this.ctx.restore();
    }
    static makeFileName() {
        var fileName= "Drawing_"
            .concat(moment().format("YYYY-MM-DD_HHmmss.SSS"))
            .concat('.png');
        return fileName;
    }
}

export default Drawing