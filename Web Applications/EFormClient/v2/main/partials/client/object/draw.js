import React, {Component} from 'react'
import CONSTANTS from '../../../config/constants'
import DrawingHelper from '../helper/drawhelper'

const DRAWING_CONST = CONSTANTS.EFORM.DRAWING


class Draw extends Component{
    constructor(){
        super()
        // this.drawHelper = new DrawHelper()
        
    }

    initDrawing() {
        this.colors     = DRAWING_CONST.COLORS
        this.sizes      = DRAWING_CONST.SIZES
        this.fontSizes  = DRAWING_CONST.FONT_SIZES
        this.lineWidths  = DRAWING_CONST.LINE_WIDTHS


        DrawingHelper.color = 'black';
        DrawingHelper.size = this.sizes[1];
        DrawingHelper.fontSize = this.fontSizes[4]
        DrawingHelper.lineWidth = this.lineWidths[3];


        this.currentImageLoaderFile = null;
        this.currentImageLoaderFileUrl =  null;
        this.rotateAngle = 0;
    }

    componentWillMount() {
        this.initDrawing();
    }

    setEvent(){

    }
    
    componentDidMount(){
        // set event to modal
        $(this.refs.modal).remodal();

        DrawingHelper.canvas = $(this.refs.myCanvas)[0];
        DrawingHelper.ctx = DrawingHelper.canvas.getContext("2d");

        DrawingHelper.canvas.width  = DrawingHelper.size.width;
        DrawingHelper.canvas.height = DrawingHelper.size.height;

        DrawingHelper.cPush();
        this.imageLoader = $(this.refs.imageLoader);
        this.setEvent();
    }

    render(){
        return (
            <div className="drawing_wrapper">
                <div data-remodal-id={"modal_" + this.props.name} ref="modal">
                  <button data-remodal-action="close" className="remodal-close"></button>
                  <h1> Drawing Editor</h1>
                    <div className="drawing-control-wrapper">
                        <div className="form-inline">
                            <select className="drawing-control form-control" onChange={this.changeSize} defaultValue={JSON.stringify(this.sizes[1])}>
                                {this.sizes.map(function(sizeItem, index){
                                    return  <option key={index} value={JSON.stringify(sizeItem)}>{sizeItem.desc}</option>
                                })}
                            </select>

                            <select className="drawing-control form-control" onChange={this.changeLineWidth} defaultValue={JSON.stringify(this.lineWidths[3])}>
                                {this.lineWidths.map(function(lineWidthItem, index){
                                    return  <option key={index} value={JSON.stringify(lineWidthItem)}>{lineWidthItem.desc}</option>
                                })}
                            </select>

                            <a className="drawing-control btn btn-default" onClick={this.cUndo}>
                                <i className="fa fa-undo"></i> Undo
                            </a>
                            <a className="drawing-control btn btn-default" onClick={this.cRedo}>
                                <i className="fa fa-repeat"></i> Redo
                            </a>

                            <a className="drawing-control btn btn-default" onClick={this.erase}>
                                <i className="fa fa-eraser"></i> Erase
                            </a>
                            <a className="drawing-control btn btn-default" onClick={this.clear}>
                                <i className="fa fa-trash-o"></i> Clear
                            </a>
                            <a className="drawing-control btn btn-default" onClick={this.capture}>
                                <i className="fa fa-camera"></i> Capture
                            </a>
                            <a className="drawing-control btn btn-success" onClick={this.uploadDrawing} data-dismiss="modal">
                                <i className="fa fa-floppy-o"></i> Save
                            </a>
                        </div>
                      
                       {/* END 1st OF ROW  CONTROL */}
                      <div className="drawing-inline">
                        <span className="drawing-control btn btn-default btn-file">
                            Load Picture<input type="file" ref="imageLoader" accept="image/*"/>
                        </span>

                            <img ref="imageLoaderPreview" height="35px"/>
                            <a className="drawing-control btn btn-default" onClick={this.rotateImageLoader} href="javascript:;">
                                <i className="fa fa-repeat"></i> Rotate & Apply
                            </a>
                        </div>
                        {/* END 2nd OF ROW  CONTROL */}
                        <div className="drawing-inline">

                            <select className="drawing-control form-control" onChange={this.changeFontSize} defaultValue={JSON.stringify(this.fontSizes[4])}>
                                {this.fontSizes.map(function(fontSizeItem, index){
                                    return  <option key={index} value={JSON.stringify(fontSizeItem)}>{fontSizeItem.desc}</option>
                                })}
                            </select>
                            <input className="drawing-control form-control" type="text" ref="canvasText" onChange={this.changeCanvasText}/>

                            <a ref="getTextBtn" className="drawing-control btn btn-default" onClick = {this.cGetText}>
                                Apply Text
                            </a>
                            <a ref="applyTextBtn" className="drawing-control btn btn-default" onClick = {this.cApplyText}>
                                Save Text
                            </a>
                        </div>
                        {/* END 3rd OF ROW  CONTROL */}
                    </div>    

                    <div>
                        <canvas ref="myCanvas" className="my_canvas"></canvas>
                    </div>
                </div>    

                {/* OPEN DA MODAL */}
                <div>
                    <div><a data-remodal-target={"modal_" + this.props.name}>Add / Edit Drawing</a></div>
                </div>


            </div>
        )
    }
}


export default Draw