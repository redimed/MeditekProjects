import React, {Component} from 'react'
import CONSTANTS from '../../../config/constants'
import DrawingHelper from '../helper/drawhelper'

const DRAWING_CONST = CONSTANTS.EFORM.DRAWING

const DEFAULT_INDEX = 2

class Draw extends Component{
    constructor(){
        super()
        this.drawingHelper = new DrawingHelper()
    }
    undo(){
        this.drawingHelper.cUndo()
    }
    redo(){
        this.drawingHelper.cRedo()
    }
    clear () {
        this.drawingHelper.clearCanvas();
        this.drawingHelper.cPush();
    }
    erase(e) {
        this.erasing = !this.erasing;
        if(this.erasing) {
            $(e.target).addClass('active')
            this.drawingHelper.color = 'white' //$(DrawingHelper.canvas).css('background-color');
            this.drawingHelper.lineWidth = {width:50, desc: 'Erase'};
            return 
        }
        $(e.target).removeClass('active')
        this.drawingHelper.color = $(this.refs.inputColor).val()
        this.drawingHelper.lineWidth = JSON.parse($(this.refs.inputLineWidth).val())
    } 

    changeLineWidth(e) {
        var canvasLineWidth = JSON.parse(e.target.value);
        if(canvasLineWidth) {
            this.drawingHelper.lineWidth = canvasLineWidth;
        }
    }

    changeColor(e) {
        this.drawingHelper.color = e.target.value
    }
    
    capture() {
        var dt = this.drawingHelper.canvas.toDataURL('image/png');
        this.refs.actionCapture.href = dt;
        this.refs.actionCapture.download = DrawingHelper.makeFileName()
    }

    changeFontSize(e) {
        this.drawingHelper.fontSize = e.target.value
    }

    changeCanvasText (e) {
        this.cText = e.target.value;
        if(this.cText) {
            $(this.refs['getTextBtn']).show()
        } else {
            $(this.refs['getTextBtn']).hide()
        }
    }

    cUnsaveTypingState(){
        var self = this
        var typingState = self.typingState;
        var img = new Image;
        img.onload = function() {
            self.drawingHelper.clearCanvas();
            self.drawingHelper.ctx.drawImage(img, 0, 0);
            self.typingState = null 
        }
        img.src = typingState;
    }
    

    cSaveTypingState() {
        var self = this;
        this.drawingHelper.canvas.toBlob(function(blob) {
            var objectUrl = URL.createObjectURL(blob);
            self.typingState = objectUrl;
        })
    }

    rotateImageLoader() {
        if(!this.degrees)
             this.degrees = 90
        // else 
        //     this.degrees += 45


        var self = this;
        var image = new Image();
        image.src = self.drawingHelper.canvas.toDataURL("image/png");
        // console.log(image.src)
        image.onload = function() {
            // 
            self.drawingHelper.ctx.save();
            self.drawingHelper.clearCanvas();
            self.drawingHelper.ctx.translate(self.drawingHelper.canvas.width/2, self.drawingHelper.canvas.height/2);
            self.drawingHelper.ctx.rotate(self.degrees*Math.PI/180);
            self.drawingHelper.ctx.drawImage(image, -image.width/2, -image.height/2);
            self.drawingHelper.ctx.restore();

            // self.drawingHelper.canvas.width = image.width
            // self.drawingHelper.canvas.height = image.height
            // self.drawingHelper.ctx.clearRect(0,0,self.drawingHelper.canvas.width,self.drawingHelper.canvas.height);

            // this.drawingHelper.ctx.drawImage(img, 0,0, image.width, image.height);

             // console.log(self.drawingHelper.canvas.width/2, self.drawingHelper.canvas.height/2)
             //  console.log('DRAW IMAGE: ', image.width, ' degrees: ',  self.degrees)
        }



      // context.fillStyle = "red";
      // context.fillRect(canvasWidth/4, canvasWidth/4, canvasWidth/2, canvasHeight/4);
      // context.fillStyle = "blue";
      // context.fillRect(canvasWidth/4, canvasWidth/2, canvasWidth/2, canvasHeight/4);
    }


    // CLICK CANCEL BUTTON
    cCancelText() {
        this.typing = false;
        this.textMove = false;

        $(this.refs.inputText).attr('disabled', false)
        $(this.refs.applyTextBtn).hide()
        $(this.refs.cancelTextBtn).hide()

        this.refs.inputText.value = '';
        this.cUnsaveTypingState()
    }

    // CLICK APPLY BUTTON
    cGetText() {
        this.cText = this.refs.inputText.value;
        $(this.refs.inputText).attr('disabled', true)
        $(this.refs.getTextBtn).hide()
        $(this.refs.applyTextBtn).show()
        $(this.refs.cancelTextBtn).show()
        this.typing= true;
        this.textMove=true;
        this.cSaveTypingState();
    }

    // CLICK TICK BUTTON
    cApplyText () {
        $(this.refs.inputText).attr('disabled', false);
        $(this.refs.applyTextBtn).hide()
        $(this.refs.cancelTextBtn).hide()
        this.typing = false;
        this.textMove = false;
        this.refs.inputText.value = '';
        this.drawingHelper.cPush();
    }

    /// CLICK SAVE BUTTON -> CLOSE MODAL 
    saveDrawing(){
        var self = this;
        if(this.drawingHelper.canvas.toBlob) {
            this.drawingHelper.canvas.toBlob(function(blob){
                $(self.refs.myCanvas).data('changed', CONSTANTS.VALUES.TRUE)
                var blobUrl = URL.createObjectURL(blob)
                $(self.refs.preview_image).attr('src', blobUrl)
                self.modal.close()
            })
        }
    }
    /***** END EVENT **********/

    updateCanvasUI() {
        $(this.refs.canvasWidth).html(this.drawingHelper.canvas.width )
        $(this.refs.canvasHeight).html(this.drawingHelper.canvas.height )
    }

    initDrawing() {
        // this.colors = DRAWING_CONST.COLORS
        // this.sizes  = DRAWING_CONST.SIZES[DEFAULT_INDEX]
        // this.fontSizes = DRAWING_CONST.FONT_SIZES
        // this.lineWidths = DRAWING_CONST.LINE_WIDTHS


        this.drawingHelper.color = 'black';
        this.drawingHelper.size = DRAWING_CONST.SIZES[DEFAULT_INDEX]
        this.drawingHelper.lineWidth = DRAWING_CONST.LINE_WIDTHS[DEFAULT_INDEX] //this.lineWidths[3];

        this.currentImageLoaderFile = null;
        this.currentImageLoaderFileUrl =  null;
        this.rotateAngle = 0;

        this.erasing = false;
        this.drawing= false;
        this.typing= false;
        this.textMove= false;

        this.lastX= null;
        this.lastY= null;
        this.typingState= null;
    }

    componentWillMount() {
        this.initDrawing();
    }

    loadImage(img) {
        // console.log(img)
        /* OLD TYPE
        var displayWidth, displayHeight = null;
        var ratio = null;
        if(img.height>img.width) {
            //Hình đứng
            displayHeight = DrawingHelper.canvas.height ;
            ratio = img.height/DrawingHelper.canvas.height;
            displayWidth = Math.floor(img.width / ratio);
        } else {
            //Hình ngang
            displayWidth = DrawingHelper.canvas.width;
            ratio = img.width/DrawingHelper.canvas.width;
            displayHeight = Math.floor(img.height/ratio);
        }
        DrawingHelper.clearCanvas()
        DrawingHelper.ctx.drawImage(img, (DrawingHelper.canvas.width-displayWidth)/2,(DrawingHelper.canvas.height-displayHeight)/2, displayWidth, displayHeight);
        DrawingHelper.cPush();
        */ 

        
        var displayWidth, displayHeight
        if(img.width > DRAWING_CONST.MAX_WIDTH_CANVAS) {
            displayWidth = DRAWING_CONST.MAX_WIDTH_CANVAS
            displayHeight = Math.floor(img.height/(img.width/displayWidth))
        } else {
            displayWidth = img.width
            displayHeight = img.height
        }

        this.drawingHelper.canvas.width = displayWidth
        this.drawingHelper.canvas.height = displayHeight

        this.drawingHelper.clearCanvas() 
        this.drawingHelper.ctx.drawImage(img, 0,0, displayWidth, displayHeight);

        this.drawingHelper.cPush();
        this.updateCanvasUI()
    }

    setEvent(){
        var self = this

        // LOAD IMAGE TO CANVAS WHEN OPEN MODAL --- DONE
        // $(document).on('opening', this.refs.modal, function () {
        //     console.log(self)
        //     var img = $(self.refs.preview_image)[0]
        //     var src = $(img).attr('src')
        //     console.log('src', src)
        //     if(!src) return
        //     DrawingHelper.cReset();
        //     self.loadImage(img).bind(self)
        //     console.log("PreDrawing");
        // });
        /// END LOAD IMAGE  WHEN OPEN MODAL 

        $(this.imageLoader).on('change', function(e){
            var file = e.target.files[0];
            if(!file) return

            var img = new Image;
            img.onload = function () {
                self.loadImage(img)
            }

            self.currentImageLoaderFile = file;
            var objectUrl = URL.createObjectURL(file);
            self.currentImageLoaderFileUrl = objectUrl;
            img.src = objectUrl;

            // $(self.refs['imageLoaderPreview']).attr('src',self.currentImageLoaderFileUrl)
        });

        $(this.drawingHelper.canvas).on('mousedown mousemove mouseup mouseout touchstart touchmove touchend', function(event){
            if(event.type === 'mousemove' && !self.drawing && !self.typing) {
                return;
            }
            event.preventDefault();
            switch(event.type) {
                case 'mousedown':
                case 'touchstart':
                    if(event.offsetX){
                        self.lastX = event.offsetX;
                        self.lastY = event.offsetY;
                    } else if(event.originalEvent) {
                        self.lastX = event.originalEvent.targetTouches[0].pageX - $(self.drawingHelper.canvas).offset().left;
                        self.lastY = event.originalEvent.targetTouches[0].pageY - $(self.drawingHelper.canvas).offset().top;
                    } else {
                        self.lastX = event.pageX - $(self.drawingHelper.canvas).offset().left;
                        self.lastY = event.pageY - $(self.drawingHelper.canvas).offset().top;
                    }
                    self.drawingHelper.ctx.beginPath();
                    if(!self.typing) {
                        self.drawing = true;
                    }
                    break;

                case 'mousemove':
                case 'touchmove':
                    if(self.typing || self.drawing) {
                        if(event.offsetX) {
                            self.currentX = event.offsetX;
                            self.currentY = event.offsetY;
                        } else if(event.originalEvent) {
                            self.currentX = event.originalEvent.targetTouches[0].pageX - $(self.drawingHelper.canvas).offset().left;
                            self.currentY = event.originalEvent.targetTouches[0].pageY - $(self.drawingHelper.canvas).offset().top;
                        } else {
                            self.currentX = event.pageX - $(self.drawingHelper.canvas).offset().left;
                            self.currentY = event.pageY - $(self.drawingHelper.canvas).offset().top;
                        }
                    }
                    if(self.drawing) {
                        self.drawingHelper.draw(self.lastX, self.lastY, self.currentX, self.currentY);
                        self.lastX = self.currentX;
                        self.lastY = self.currentY;
                    }
                    if(self.typing && self.textMove) {
                        var img = new Image;
                        img.onload = function() {
                            self.drawingHelper.clearCanvas();
                            self.drawingHelper.ctx.drawImage(img, 0, 0);
                            self.drawingHelper.drawText(self.cText, self.currentX, self.currentY);
                        }
                        img.src = self.typingState;
                    }
                    break;
                case 'mouseup':
                case 'touchend':
                    if(self.typing) {
                        self.textMove = !self.textMove;
                    } else {
                        self.drawingHelper.cPush();
                    }
                case 'mouseout':
                    self.drawing = false;

            }
        });
    }
    
    openModal() {
        var img = $(this.refs.preview_image)[0]
        var src = $(img).attr('src')
        this.modal.open()
        // self.drawingHelper.canvas = this.canvas
        // self.drawingHelper.ctx = this.ctx

        if(src.indexOf('nosign.gif') > 0) 
            return

        this.drawingHelper.cReset();
        this.loadImage(img)
        
    }

   

    componentDidMount(){
        // set event to modal
        this.modal = $(this.refs.modal).remodal();

        this.drawingHelper.canvas = $(this.refs.myCanvas)[0];
        this.drawingHelper.ctx = this.drawingHelper.canvas.getContext("2d");

        this.drawingHelper.canvas.width  = this.drawingHelper.size.width;
        this.drawingHelper.canvas.height = this.drawingHelper.size.height;
        this.drawingHelper.cPush();
        
        // this.canvas = DrawingHelper.canvas
        // this.ctx = DrawingHelper.ctx

        this.imageLoader = $(this.refs.imageLoader);
        this.setEvent();
    }

    render(){
        return (
                <div ref="drawing_wrapper" className="drawing_wrapper">
                    <div data-remodal-id={"modal_" + this.props.name} ref="modal">
                      <button data-remodal-action="close" className="remodal-close"></button>
                      <h1> Drawing Editor</h1>
                        <div className="drawing-control-wrapper">
                            <div className="drawing-inline">
                                <span className="drawing-control" > W: <span ref="canvasWidth">300</span>px | H: <span ref="canvasHeight">300</span>px </span>
                                <select  ref="inputLineWidth"  className="drawing-control form-control" 
                                        onChange={this.changeLineWidth.bind(this)} defaultValue={JSON.stringify(DRAWING_CONST.LINE_WIDTHS[DEFAULT_INDEX])}>
                                    {DRAWING_CONST.LINE_WIDTHS.map(function(lineWidthItem, index){
                                        return  <option key={index} value={JSON.stringify(lineWidthItem)}>{lineWidthItem.desc}</option>
                                    })}
                                </select>

                                <a className="drawing-control btn btn-default" onClick={this.undo.bind(this)}>
                                    <i className="fa fa-undo"></i> Undo
                                </a>
                                <a className="drawing-control btn btn-default" onClick={this.redo.bind(this)}>
                                    <i className="fa fa-repeat"></i> Redo
                                </a>

                                <a className="drawing-control btn btn-default" onClick={this.erase.bind(this)}>
                                    <i className="fa fa-eraser"></i> Erase
                                </a>
                                <a className="drawing-control btn btn-default" onClick={this.clear.bind(this)}>
                                    <i className="fa fa-trash-o"></i> Clear
                                </a>
                                <a download="capture.png" ref="actionCapture" className="drawing-control btn btn-default" onClick={this.capture.bind(this)}>
                                    <i className="fa fa-camera"></i> Capture
                                </a>
                                <a className="drawing-control btn btn-success" onClick={this.saveDrawing.bind(this)} data-dismiss="modal">
                                    <i className="fa fa-floppy-o"></i> Save
                                </a>
                            </div>
                          
                           {/* END 1st OF ROW  CONTROL */}
                          <div className="drawing-inline">
                                <span className="drawing-control btn btn-default">
                                    Color: <input onChange={this.changeColor.bind(this)} ref="inputColor" type="color"/>
                                </span>

                                <span className="drawing-control btn btn-default btn-file">
                                    Load Picture<input type="file" ref="imageLoader" accept="image/*"/>
                                </span>

                                <a className="drawing-control btn btn-default" onClick={this.rotateImageLoader.bind(this)} href="javascript:;">
                                    <i className="fa fa-repeat"></i> Rotate & Apply
                                </a>
                            </div>
                            {/* END 2nd OF ROW  CONTROL */}
                            <div className="drawing-inline">

                                <select className="drawing-control" onChange={this.changeFontSize.bind(this)} defaultValue={DRAWING_CONST.FONT_SIZES[DEFAULT_INDEX]}>
                                    {DRAWING_CONST.FONT_SIZES.map(function(fontSizeItem, index){
                                        return  <option key={index} value={fontSizeItem.size}>{fontSizeItem.desc}</option>
                                    })}
                                </select>
                                <input className="drawing-control" style={{'padding-left': '7px'}} type="text" ref="inputText" onChange={this.changeCanvasText.bind(this)}/>

                                <a ref="getTextBtn" style={{display: 'none', color: 'blue'}} className="drawing-control btn btn-default" onClick = {this.cGetText.bind(this)}>
                                    <i className="fa fa-send"></i> Apply Text
                                </a>
                                <a ref="applyTextBtn" style={{display: 'none', color: 'green'}} className="drawing-control btn btn-default" onClick = {this.cApplyText.bind(this)}>
                                    <i className="fa fa-check"></i> Save Text
                                </a>
                                <a ref="cancelTextBtn" style={{display: 'none', color: 'red'}} className="drawing-control btn btn-default" onClick = {this.cCancelText.bind(this)}>
                                     <i className="fa fa-times"></i>Cancel Text
                                </a>
                            </div>
                            {/* END 3rd OF ROW  CONTROL */}
                        </div>    

                        <div>
                            <canvas data-changed={CONSTANTS.VALUES.FALSE} id={this.props.name} ref="myCanvas" className="my_canvas"></canvas>
                        </div>
                    </div>    

                    {/* OPEN DA MODAL */}
                    <div>
                        <div><img id={ this.props.name + '_image'} style={{width: '100%'}} ref="preview_image" src="/images/nosign.gif" /></div>
                        <div><a className="drawing-control" onClick={this.openModal.bind(this)}>Add / Edit Drawing</a></div>
                    </div>


            </div>
        )
    }
}


export default Draw