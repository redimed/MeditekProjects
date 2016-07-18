var Config = require('config');
var CommonModal = require('common/modal');
module.exports = React.createClass({
    value: '',
    propTypes: {
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        refTemp: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
        permission: React.PropTypes.string,
        preCal: React.PropTypes.string,
    },
    getDefaultProps: function(){
        return {
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12'
        }
    },
    componentWillMount: function() {
        this.initDrawing();
    },
    componentDidMount: function(){
        var self = this;
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) {
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp);
                }.bind(this)
            })
        }
        if(this.props.permission === 'eformDev'){
            $(this.refs['modal-edit-drawing-btn']).prop('disabled', true);
        }
        if(typeof this.props.defaultValue !== 'undefined'){
            $(this.refs.input).val(this.props.defaultValue);
        }
        $(this.refs.input).on('change', function(event){
            if(typeof self.props.onChange !== 'undefined'){
                self.props.onChange();
            }
        })
        $(this.refs.input).on('keypress',function(event){
            if(typeof self.props.onKeyPress !== 'undefined'){
                self.props.onKeyPress(event);
            }
        })

        //tannv.dts
        this.canvas = $(this.refs['myCanvas'])[0];
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.cPush();
        this.imageLoader = $(this.refs['imageLoader'])[0];
        $(this.imageLoader).on('change', function(e){
            console.log("imageLoader",$(self.imageLoader));
            self.currentImageLoaderFile = e.target.files[0];
            var objectUrl = URL.createObjectURL(e.target.files[0]);
            self.currentImageLoaderFileUrl = URL.createObjectURL(e.target.files[0]);
            $(self.refs['imageLoaderPreview']).attr('src',self.currentImageLoaderFileUrl)
            var img = new Image;
            var flagRotate = false;

            img.onload = function () {
                self.clearCanvas();
                //----------------------
                var displayWidth, displayHeight = null;
                var ratio = null;
                if(img.height>img.width) {
                    //Hình đứng
                    displayHeight = self.canvas.height ;
                    ratio = img.height/self.canvas.height;
                    displayWidth = Math.floor(img.width / ratio);
                } else {
                    //Hình ngang
                    displayWidth = self.canvas.width;
                    ratio = img.width/self.canvas.width;
                    displayHeight = Math.floor(img.height/ratio);
                }
                self.ctx.drawImage(img, (self.canvas.width-displayWidth)/2, (self.canvas.height-displayHeight)/2, displayWidth, displayHeight);
                self.cPush();
                // self.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            img.src = objectUrl;
        });


        /*$.ajax({
            url: Config.apiServerUrl+'api/downloadFileWithoutLogin/9c5e637c-1852-4dd9-b901-82f99fe6b09d',
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            processData: false,
            contentType: false,
            responseType:'arraybuffer'
        }).done(function(respond){
            console.log(respond);
            var blob = new Blob([respond],{type: 'image/png'});
            saveAs(blob,"aa.png");
        }).fail(function(error) {
            console.log("error ne")
            console.log(error);
        })*/

        if(this.value) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', Config.apiServerUrl+'api/downloadFileWithoutLogin/'+this.value, true);
            xhr.onload = function(e) {
                var blob = new Blob([this.response],{type: 'image/png'});
                var objectUrl = URL.createObjectURL(blob);
                var img = new Image;
                img.onload = function () {
                    self.clearCanvas();
                    //----------------------
                    var displayWidth, displayHeight = null;
                    var ratio = null;
                    if(img.height>img.width) {
                        //Hình đứng
                        displayHeight = self.canvas.height ;
                        ratio = img.height/self.canvas.height;
                        displayWidth = Math.floor(img.width / ratio);
                    } else {
                        //Hình ngang
                        displayWidth = self.canvas.width;
                        ratio = img.width/self.canvas.width;
                        displayHeight = Math.floor(img.height/ratio);
                    }
                    self.ctx.drawImage(img, (self.canvas.width-displayWidth)/2, (self.canvas.height-displayHeight)/2, displayWidth, displayHeight);
                    self.cPush();
                    console.log("PreDrawing");
                }
                img.src = objectUrl;
            };
            xhr.send();
        }





        $(this.canvas).on('mousedown mousemove mouseup mouseout touchstart touchmove touchend', function(event){
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
                        self.lastX = event.originalEvent.targetTouches[0].pageX - $(self.canvas).offset().left;
                        self.lastY = event.originalEvent.targetTouches[0].pageY - $(self.canvas).offset().top;
                    } else {
                        self.lastX = event.pageX - $(self.canvas).offset().left;
                        self.lastY = event.pageY - $(self.canvas).offset().top;
                    }
                    self.ctx.beginPath();
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
                            self.currentX = event.originalEvent.targetTouches[0].pageX - $(self.canvas).offset().left;
                            self.currentY = event.originalEvent.targetTouches[0].pageY - $(self.canvas).offset().top;
                        } else {
                            self.currentX = event.pageX - $(self.canvas).offset().left;
                            self.currentY = event.pageY - $(self.canvas).offset().top;
                        }
                    }
                    if(self.drawing) {
                        self.draw(self.lastX, self.lastY, self.currentX, self.currentY);
                        self.lastX = self.currentX;
                        self.lastY = self.currentY;
                    }
                    if(self.typing && self.textMove) {
                        var img = new Image;
                        img.onload = function() {
                            self.clearCanvas();
                            self.ctx.drawImage(img, 0, 0);
                            self.drawText(self.currentX, self.currentY);
                        }
                        img.src = self.typingState;
                    }
                    break;
                case 'mouseup':
                case 'touchend':
                    if(self.typing) {
                        self.textMove = !self.textMove;
                    } else {
                        self.cPush();
                    }
                case 'mouseout':
                    self.drawing = false;

            }
        });

        $(self.refs['getTextBtn']).attr('disabled', true);
        $(self.refs['applyTextBtn']).attr('disabled', true);

    },

    loadDrawingForEdit: function() {
        var self = this;
        if(this.value) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', Config.apiServerUrl+'api/downloadFileWithoutLogin/'+this.value, true);
            xhr.onload = function(e) {
                var blob = new Blob([this.response],{type: 'image/png'});
                var objectUrl = URL.createObjectURL(blob);
                var img = new Image;
                img.onload = function () {
                    self.clearCanvas();
                    //----------------------
                    var displayWidth, displayHeight = null;
                    var ratio = null;
                    if(img.height>img.width) {
                        //Hình đứng
                        displayHeight = self.canvas.height ;
                        ratio = img.height/self.canvas.height;
                        displayWidth = Math.floor(img.width / ratio);
                    } else {
                        //Hình ngang
                        displayWidth = self.canvas.width;
                        ratio = img.width/self.canvas.width;
                        displayHeight = Math.floor(img.height/ratio);
                    }
                    self.ctx.drawImage(img, (self.canvas.width-displayWidth)/2, (self.canvas.height-displayHeight)/2, displayWidth, displayHeight);
                    self.cPush();
                    console.log("PreDrawing");
                }
                img.src = objectUrl;
            };
            xhr.send();
        }
    },


    rotateImageLoader:function() {
        console.log("||||||||||||||||||||||||rotateImageLoader:");
        if(this.currentImageLoaderFileUrl) {
            var self = this;
            var img = new Image;
            img.onload = function () {
                self.clearCanvas();
                self.rotateAngle = self.nextRotateAngle();
                console.log('rotateAngle', self.rotateAngle);
                var sameLayout = self.rotateAngle/Math.PI%1 == 0;
                console.log("sameLayout", sameLayout);
                var displayWidth, displayHeight = null;
                var canvasWidth = sameLayout?self.canvas.width:self.canvas.height;
                var canvasHeight = sameLayout?self.canvas.height:self.canvas.width;

                var quarterList = [
                    0, //phan tu thu 1
                    (1/2)*Math.PI, //phan tu thu 2
                    Math.PI, //phan tu thu 3
                    (3/2)*Math.PI, //phan tu thu 4
                ]
                var quarter = 0; //mac dinh phan tu thu 1

                var quarterVector = {
                    0: {w: 0,h: 0}, //phan tu thu 1
                    1: {w: 0, h: -self.canvas.width}, //phan tu thu 2
                    2: {w: -self.canvas.width, h: -self.canvas.height}, //phan tu thu 3
                    3: {w: -self.canvas.height, h: 0} //phan tu thu 4
                }

                var ratio = null;
                if(img.height > img.width) {
                    console.log("Hinh dung")
                    displayHeight = canvasHeight ;
                    ratio = img.height/canvasHeight;
                    displayWidth = Math.floor(img.width / ratio);
                } else {
                    console.log("Hinh ngang");
                    displayWidth = canvasWidth;
                    ratio = img.width/canvasWidth;
                    displayHeight = Math.floor(img.height/ratio);
                }

                for(var i =0; i<quarterList.length; i++) {
                    if(quarterList[i] == self.rotateAngle) {
                        quarter = i;
                        break;
                    }
                }
                console.log("quarter", quarter, quarterList[quarter]);
                self.ctx.save();
                self.ctx.rotate(self.rotateAngle);
                self.ctx.drawImage(img,quarterVector[quarter].w + (canvasWidth-displayWidth)/2, quarterVector[quarter].h +(canvasHeight-displayHeight)/2 , displayWidth, displayHeight);
                self.cPush();
                self.ctx.restore();
                // self.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            img.src = this.currentImageLoaderFileUrl;
        }
    },

    componentWillReceiveProps: function(nextProps){
        $(this.refs.input).val(nextProps.defaultValue);
    },
    onBelongsGroup: function(group){
        var self = this;
        $('input[name='+group+']').on('ifClicked', function(event){
            var value = event.target.value;
            if(isNaN(value))
                value = 0;
            $(self.refs.input).val(parseInt(value)).change();
        })
    },
    setValue: function(value){
        this.value = value;
        this.updateImageViewable();
    },

    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.input).attr('disabled', true);
        }else{
            $(this.refs.input).css('display', 'none');
        }
    },
    getValue: function(){
        return this.value;
    },
    getName: function(){
        return this.props.name;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
    getCode: function(){
        return this.props.code;
    },
    getPreCal: function(){
        return this.props.preCal;
    },
    getCal: function(){
        return this.props.cal;
    },
    getRoles: function(){
        return this.props.roles;
    },
    isSelected: false,
    getIsSelected: function() {
        return this.isSelected;
    },
    selection: function () {
        if(!this.isSelected)
        {
            this.isSelected = true;
            $(this.refs.input).addClass('eform-selection-field');
        } else {
            this.isSelected = false;
            $(this.refs.input).removeClass('eform-selection-field');
        }

    },

    initDrawing: function() {
        this.canvas= null;
        this.ctx=null;
        this.drawing= false;
        this.lastX= null;
        this.lastY= null;
        this.typing= false;
        this.textMove= false;
        this.typingState= null;

        this.colors= [
            {'color': 'blue-ebonyclay'},
            {'color': 'green'},
            {'color': 'blue'},
            {'color': 'red'}
        ],
        this.color= 'black';
        this.sizes= [
            {'width':550,'height':500,desc:'Canvas 550x500'},
            {'width':750,'height':650,desc:'Canvas 750x650'},
            // {'width':650,'height':650,desc:'Canvas 750x650'},
            {'width':900,'height':750,desc:'Canvas 900x750'},
            {'width':1000,'height':900,desc:'Canvas 1100x900'},
        ];

        this.size = this.sizes[1];

        this.fontSizes= [
            {size:12,desc:'Font 12px'},
            {size:15,desc:'Font 15px'},
            {size:20,desc:'Font 20px'},
            {size:25,desc:'Font 25px'},
            {size:30,desc:'Font 30px'},
        ];

        this.fontSize = this.fontSizes[4];

        this.lineWidths = [
            {width:1, desc:'Line 1'},
            {width:2, desc:'Line 2'},
            {width:3, desc:'Line 3'},
            {width:4, desc:'Line 4'},
            {width:5, desc:'Line 5'},
        ];

        this.lineWidth=this.lineWidths[3];//tannv.dts todo

        this.cPushArray= new Array();
        this.cStep= -1;

        this.userUID= null;

        this.fileType= 'MedicalImage';

        this.currentImageLoaderFile = null;
        this.currentImageLoaderFileUrl =  null;
        this.rotateAngle = 0;
    },

    nextRotateAngle: function() {
        if(this.rotateAngle == (3/2)*Math.PI) {
            return 0;
        } else {
            return this.rotateAngle + Math.PI/2;
        }
    },



    makeFileName: function() {
        var fileName= "Drawing_"
            .concat(moment().format("YYYY-MM-DD_HHmmss.SSS"))
            .concat('.png');
        return fileName;
    },

    capture: function() {
        //tannv.dts@gmail.com todo....
        var self = this;
        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob) {
                saveAs(blob,self.makeFileName());
            })
        }
    },

    updateImageViewable: function() {
        var self = this;
        if(this.value) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', Config.apiServerUrl+'api/downloadFileWithoutLogin/'+this.value, true);
            xhr.onload = function(e) {
                var blob = new Blob([this.response],{type: 'image/png'});
                var objectUrl = URL.createObjectURL(blob);
                $(self.refs['imageViewable']).attr('src', objectUrl);
            };
            xhr.send();
        }
    },


    action: function(fileInfo) {
        this.setValue(fileInfo.UID);
    },

    uploadDrawing: function() {
        var self = this;
        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob){
                var formdata = new FormData();
                formdata.append('userUID', '2d0626f3-e741-11e5-8fab-0050569f3a15');
                formdata.append('fileType', self.fileType);
                var fileName = self.makeFileName();
                formdata.append('uploadFile', blob, fileName);
                $.ajax({
                    url: Config.apiServerUrl+'api/uploadFileWithoutLogin',
                    xhrFields: {
                        withCredentials: true
                    },
                    headers:{
                        //Authorization: ('Bearer ' + $cookies.get("token")),
                        systemtype: 'WEB',
                        userUID: '2d0626f3-e741-11e5-8fab-0050569f3a15',
                        fileType: self.fileType
                    },
                    type: "POST",
                    data: formdata,
                    processData: false,
                    contentType: false,
                }).done(function(respond){
                    console.log(respond);
                    if(respond.status=='success')
                    {
                        toastr.success("Save drawing successfully", "success");
                        self.action(respond.fileInfo);
                    }
                }).fail(function(error) {
                    toastr.error("Save drawing error", "error");
                    console.log("error ne");
                    console.log(error);
                }).complete(function() {

                })
            })
        }
    },

    cPush: function() {
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

    cSaveTypingState: function() {
        var self = this;
        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob) {
                var objectUrl = URL.createObjectURL(blob);
                self.typingState = objectUrl;
            })
        }
    },

    changeCanvasText: function (e) {
        this.cText = e.target.value;
        if(this.cText) {
            $(this.refs['getTextBtn']).attr('disabled', false);
        } else {
            $(this.refs['getTextBtn']).attr('disabled', true);
        }
    },

    cGetText: function() {
        console.log("cGetText");
        this.cText = $(this.refs['canvasText']).val();
        $(this.refs['getTextBtn']).attr('disabled', true);
        $(this.refs['applyTextBtn']).attr('disabled', false);
        this.typing= true;
        this.textMove=true;
        this.cSaveTypingState();
    },

    cApplyText: function () {
        $(this.refs['getTextBtn']).attr('disabled', false);
        $(this.refs['applyTextBtn']).attr('disabled', true);
        this.typing = false;
        this.textMove = false;
        this.cPush();
    },

    cClearTyping: function() {
        this.typing = false;
        this.textMove = false;
        this.typingState = null;
    },

    drawText: function(currentX, currentY) {
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.fontSize.size+"px Arial";
        this.ctx.fillText(this.cText, currentX, currentY);
    },


    changeColor: function(c) {
        if(c== 'blue-ebonyclay') {
            this.color = 'black';
        } else {
            this.color = c;
        }
        this.lineWidth = this.lineWidth.width;
        this.erasing = false;
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

    clear: function () {
        this.clearCanvas();
        this.cPush();
    },
    
    erase: function() {
        this.color = $(this.canvas).css('background-color');
        this.lineWidth = {width:50, desc: 'Erase'};
        this.erasing = true;
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

    imageLoaderClick: function () {
        this.cClearTyping();
    },






    changeSize: function(e) {
        var canvasSize = JSON.parse(e.target.value);
        if(canvasSize) {
            this.size = canvasSize;
            this.canvas.width=this.size.width;
            this.canvas.height=this.size.height;
        }

    },

    changeFontSize: function(e) {
        var canvasFontSize = JSON.parse(e.target.value);
        if(canvasFontSize) {
            this.fontSize = canvasFontSize;
        }
    },

    changeLineWidth: function(e) {
        var canvasLineWidth = JSON.parse(e.target.value);
        if(canvasLineWidth) {
            this.lineWidth = canvasLineWidth;
        }
    },

    render: function(){
        var type = this.props.type;
        var html = null;
        var display_name = null;
        if(this.props.permission === 'eformDev'){
            display_name = (
                <div style={{position: 'absolute', top: -30, left: 0, backgroundColor: 'green', color: 'white', padding: 5}}>
                    {this.props.name}
                </div>
            )
        };
        var inputStyle = {
            paddingLeft: '1px',
            paddingRight:'1px'
        };

        switch(type){
            case 'default':
                html = (
                    <input type="text" name={this.props.name} className={this.props.className} ref="input"
                           defaultValue={this.props.defaultValue} style={this.props.style}
                           onBlur={this.props.onBlur} onChange={this.props.onChange}/>
                )
                break;
            case 'it':
                html = (
                    <input type="text" name={this.props.name} className="form-control" ref="input"/>
                )
                break;
            {/*case 'eform_input_text':
             html = (
             <div className={"dragField col-xs-"+this.props.size} ref="group">
             {display_name}
             <div className="form-group" id={this.props.groupId}>
             <div className="col-xs-12">
             <input type="text" className={this.props.className} ref="input"/>
             </div>
             </div>
             </div>
             )*/}
            case 'eform_input_image_object':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>

                            <div className="col-xs-12">
                                <img ref ="imageViewable" style ={{maxWidth: "100%"}}/>
                            </div>
                            <div className="col-xs-12" >
                                <button ref="modal-edit-drawing-btn" type="button" className="btn btn-default" data-toggle="modal" data-target={'.image-object'+this.props.refTemp} onClick = {this.loadDrawingForEdit}>Add/Edit Drawing</button>

                                <div className={"modal fade image-object" +this.props.refTemp} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" style={{overflowY:'scroll'}}>
                                    <div className="modal-dialog modal-lg" style = {{width: "80vw"}}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h4 className="modal-title" id="myModalLabel">Edit Drawing</h4>
                                            </div>
                                            <div className="modal-body" style = {{overflowX: 'scroll', overflowY: 'scroll'}}>
                                                <div className="row">
                                                    <div className="col-md-12 col-sm-12 eform-drawing">
                                                        <div className="form-inline">
                                                            <select className="form-control" onChange={this.changeSize} defaultValue={JSON.stringify(this.sizes[1])}>
                                                                {this.sizes.map(function(sizeItem, index){
                                                                    return  <option key={index} value={JSON.stringify(sizeItem)}>{sizeItem.desc}</option>
                                                                })}
                                                            </select>

                                                            <select className="form-control" onChange={this.changeLineWidth} defaultValue={JSON.stringify(this.lineWidths[3])}>
                                                                {this.lineWidths.map(function(lineWidthItem, index){
                                                                    return  <option key={index} value={JSON.stringify(lineWidthItem)}>{lineWidthItem.desc}</option>
                                                                })}
                                                            </select>

                                                            {/*<a href="javascript:;"
                                                             className="btn btn-icon-only btn-circle">
                                                             </a>*/}

                                                            <a className="btn btn-default" onClick={this.cUndo} href="javascript:;">
                                                                <i className="fa fa-undo"></i> Undo
                                                            </a>
                                                            <a className="btn btn-default" onClick={this.cRedo} href="javascript:;">
                                                                <i className="fa fa-repeat"></i> Redo
                                                            </a>

                                                            <a className="btn btn-default" onClick={this.erase} href="javascript:;">
                                                                <i className="fa fa-eraser"></i> Erase
                                                            </a>
                                                            <a className="btn btn-default" onClick={this.clear} href="javascript:;">
                                                                <i className="fa fa-trash-o"></i> Clear
                                                            </a>

                                                            <a className="btn btn-default" onClick={this.capture} href="javascript:;">
                                                                <i className="fa fa-camera"></i> Capture
                                                            </a>

                                                            <a href="javascript:;"
                                                               className="btn btn-icon-only btn-circle">
                                                            </a>

                                                            <a className="btn btn-success" onClick={this.uploadDrawing} data-dismiss="modal">
                                                                <i className="fa fa-floppy-o"></i> Save
                                                            </a>

                                                        </div>

                                                        <br/>
                                                        <div className="form-inline">
                                                <span className="btn btn-default btn-file">
                                                    Load Picture<input type="file" ref="imageLoader" accept="image/*"/>
                                                </span>
                                                            <img ref="imageLoaderPreview" height="35px"/>
                                                            <a className="btn btn-default" onClick={this.rotateImageLoader} href="javascript:;">
                                                                <i className="fa fa-repeat"></i> Rotate & Apply
                                                            </a>

                                                            <a href="javascript:;"
                                                               className="btn btn-icon-only btn-circle">
                                                            </a>
                                                        </div>
                                                        <br/>
                                                        <div className="form-inline">

                                                            <select className="form-control" onChange={this.changeFontSize} defaultValue={JSON.stringify(this.fontSizes[4])}>
                                                                {this.fontSizes.map(function(fontSizeItem, index){
                                                                    return  <option key={index} value={JSON.stringify(fontSizeItem)}>{fontSizeItem.desc}</option>
                                                                })}
                                                            </select>
                                                            <input className="form-control" type="text" ref="canvasText" onChange={this.changeCanvasText}/>

                                                            <a ref="getTextBtn" className="btn btn-default" onClick = {this.cGetText}>
                                                                Apply Text
                                                            </a>
                                                            <a ref="applyTextBtn" className="btn btn-default" onClick = {this.cApplyText}>
                                                                Save Text
                                                            </a>
                                                        </div>
                                                        <br/>
                                                        <canvas ref="myCanvas" className="myCanvas"></canvas>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>




                    </div>
                )
        }
        return html;
    }
})
