var Config = require('config');
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
            $(this.refs.input).prop('disabled', true);
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
        this.canvas = $("#myCanvas")[0];
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa", this.canvas);

        this.ctx = this.canvas.getContext("2d");
        alert(JSON.stringify(this.size));
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.cPush();
        this.imageLoader = $('#imageLoader')[0];
        $(this.imageLoader).on('change', function(e){
            var objectUrl = URL.createObjectURL(e.target.files[0]);
            var img = new Image;
            img.onload = function () {
                this.clearCanvas();
                this.ctx.drawImage(img, (this.canvas.width - img.width) / 2, (this.canvas.height - img.height)/2);
                this.cPush();
            }
            img.src = objectUrl;
        });

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
                            self.drawText(currentX, currentY);
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
        self.value = value;
        $(this.refs.input).val(value).change();
    },

    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.input).attr('disabled', true);
        }else{
            $(this.refs.input).css('display', 'none');
        }
    },
    getValue: function(){
        return $(this.refs.input).val()
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
        ],

        this.fontSize = this.fontSizes[4];

        this.lineWidth=3;

        this.cPushArray= new Array();
        this.cStep= -1;

        this.userUID= null;

        this.fileType= null;

        linewidth= null;
    },



    makeFileName: function() {
        var fileName= "Drawing_"
            .concat(moment().format("YYYY-MM-DD_HHmmss.SSS"))
            .concat('.jpg');
        return fileName;
    },

    capture: function() {
        //tannv.dts@gmail.com todo....
        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob) {
                //todo
            })
        }
    },



    action: function(fileInfo) {
        alert(JSON.stringify(fileInfo));
    },

    uploadDrawing: function() {
        if(canvas.toBlob) {
            canvas.toBlob(function(blob){
                var formdata = new FormData();
                formdata.append('userUID', this.userUID);
                formdata.append('fileType', this.fileType);
                var fileName = this.makeFileName();
                formdata.append('uploadFile', blob, fileName);
                $.ajax({
                    url: Config.apiServerUrl+'/api/uploadFileWithoutLogin',
                    xhrFields: {
                        withCredentials: true
                    },
                    headers:{
                        //Authorization: ('Bearer ' + $cookies.get("token")),
                        //systemtype: 'WEB',
                        //userUID: scope.data.userUID,
                        fileType: this.fileType
                    },
                    type: "POST",
                    data: formdata,
                    processData: false,
                    contentType: false,
                }).done(function(respond){
                    console.log(respond);
                    if(respond.status=='success')
                    {
                        // console.log('respond',respond);
                        // CommonService.downloadFile(respond.fileUID);
                        toastr.success("Save drawing successfully", "success");
                        this.action(respond.fileInfo);
                    }
                });
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

    clearCanvas: function () {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    },

    cUndo: function() {
        if(this.cStep>0) {
            this.cStep--;
            var img = new Image;
            img.onload = function () {
                this.clearCanvas();
                this.ctx.drawingImage(img, 0, 0);
            }
            img.src= this.cPushArray[this.cStep];
        }
    },

    cRedo: function() {
        if(this.cStep<this.cPushArray.length-1) {
            this.cStep++;
            var img=new Image();
            img.onload=function() {
                this.clearCanvas();
                this.ctx.drawingImage(img, 0, 0);
            }
            img.src=this.cPushArray[this.cStep];
        }
    },

    cSaveTypingState: function() {
        if(this.canvas.toBlob) {
            this.canvas.toBlob(function(blob) {
                var objectUrl = URL.createObjectURL(blob);
                this.typingState = objectUrl;
            })
        }
    },

    cGetText: function() {
        this.typing= true;
        this.textMove=true;
        this.cSaveTypingState();
    },

    cClearTyping: function() {
        this.typing = false;
        this.textMove = false;
        this.typingState = null;
    },

    drawText: function(currentX, currentY) {
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.fontSize+"px Arial";
        this.ctx.fillText(this.cText, currentX, currentY);
    },


    changeColor: function(c) {
        if(c== 'blue-ebonyclay') {
            this.color = 'black';
        } else {
            this.color = c;
        }
        this.lineWidth = this.linewidth;
        this.erasing = false;
    },

    clearCanvas: function() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    },

    clear: function () {
        this.clearCanvas();
        this.cPush();
    },
    
    erase: function() {
        this.color = $('#myCanvas')[0].css('background-color');
        this.lineWidth = 50;
        this.erasing = true;
    },

    draw: function(lX, lY, cX, cY) {
        this.ctx.lineCap = "round";
        this.ctx.fillStyle = "solid";
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.moveTo(lX,lY);
        this.ctx.lineTo(cX,cY);
        this.ctx.stroke();
    },

    imageLoaderClick: function () {
        this.cClearTyping();
    },






    _onCanvasSizeChange: function(e) {
        var canvasSize = JSON.parse(e.target.value);
        if(canvasSize) {
            this.size = canvasSize;
            this.canvas.width=this.size.width;
            this.canvas.height=this.size.height;
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
                            this is Image Object
                            <div className="col-xs-12">
                                <input type="text" name={this.props.name} className={this.props.className} style={inputStyle} ref="input" id={this.props.refTemp} onDoubleClick = {this.selection}/>
                            </div>
                        </div>

                        <div ref="canvasPanel" className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="form-inline">
                                    <select className="form-control" onChange={this._onCanvasSizeChange}>
                                        {this.sizes.map(function(sizeItem, index){
                                            return  <option key={index} value={JSON.stringify(sizeItem)}>{sizeItem.desc}</option>
                                        })}
                                    </select>

                                    <a href="javascript:;"
                                       className="btn btn-icon-only btn-circle">
                                    </a>

                                    <a className="btn btn-icon-only btn-circle btn-default" >
                                        <i className="fa fa-undo"></i>
                                    </a>
                                    <a className="btn btn-icon-only btn-circle btn-default" >
                                        <i className="fa fa-repeat"></i>
                                    </a>

                                    <a className="btn btn-icon-only btn-circle btn-default" >
                                        <i className="fa fa-eraser"></i>
                                    </a>
                                    <a className="btn btn-icon-only btn-circle btn-default" >
                                        <i className="fa fa-trash-o"></i>
                                    </a>

                                    <a className="btn btn-icon-only btn-circle btn-default" >
                                        <i className="fa fa-camera"></i>
                                    </a>

                                        <span className="btn btn-default btn-file">
                                            Load Picture<input type="file" id="imageLoader" accept="image/*"/>
                                        </span>

                                    <a className="btn btn-success" >
                                        <i className="fa fa-floppy-o"></i> Save
                                    </a>

                                </div>
                                <br/>
                                <div className="form-inline">
                                    <select className="form-control">
                                    </select>
                                    <input className="form-control" type="text"/>

                                    <a className="btn btn-default">
                                        Apply Text
                                    </a>
                                    <a className="btn btn-default">
                                        Save Text
                                    </a>
                                </div>
                                <br/>
                                <canvas id="myCanvas"></canvas>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
    }
})
