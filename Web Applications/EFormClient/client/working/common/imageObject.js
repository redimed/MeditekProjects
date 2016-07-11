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

    sizes: [
        {'width':550,'height':500,desc:'Canvas 550x500'},
        {'width':750,'height':650,desc:'Canvas 750x650'},
        {'width':900,'height':750,desc:'Canvas 900x750'},
        {'width':1000,'height':900,desc:'Canvas 1100x900'},
    ],

    size: null,

    _onCanvasSizeChange: function(e) {
        var canvasSize = JSON.parse(e.target.value);
        if(canvasSize) {
            this.size = canvasSize;
            var canvas = $(this.refs['canvasPanel']).context.querySelector('canvas');
            console.log("AAA",$('#mycanvas').getContext());
            canvas.width=this.size.width;
            canvas.height=this.size.height;
            var ctx = canvas.getContext("2d");
            console.log(ctx);
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
        }
        var inputStyle = {
            paddingLeft: '1px',
            paddingRight:'1px'
        }
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
                                            return  <option value={JSON.stringify(sizeItem)}>{sizeItem.desc}</option>
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
                                        <i class="fa fa-eraser"></i>
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
