module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
        height: React.PropTypes.string
    },
    getDefaultProps: function(){
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12',
            height: 'auto'
        }
    },
    componentDidMount: function(){
        var self = this;
        setTimeout(function(){
            $(self.refs.signature).jSignature({width: '100%', height: self.props.height});
        })

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
    },
    setValue: function(value){
        if(value !== null && value !== ''){
            if(typeof value.join !== 'undefined'){
                valueArr = value.join(",");
                if(valueArr !== "image/jsignature;base30,"){
                    if(typeof $(this.refs.signature).jSignature !== 'undefined')
                        $(this.refs.signature).jSignature("setData", "data:" + value.join(","));
                }
            }
        }
    },
    setHeight: function(height){
        $(this.refs.signature).jSignature({height: height});
    },
    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.layer).css('zIndex', '100');
        }else{
            $(this.refs.signature).css('display', 'none');
            $(this.refs.reset).css('display', 'none');
        }
    },
    getValue: function(){
        return $(this.refs.signature).jSignature('getData', 'base30');
    },
    getBase64Value: function(){
        var data = $(this.refs.signature).jSignature('getData', 'default');
        data = data.replace('data:image/png;base64,','');  
       return data;
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
    getHeight: function(){
        return this.props.height;
    },
    getRoles: function(){
        return this.props.roles;
    },
    _onReset: function(){
        $(this.refs.signature).jSignature("reset");
    },
    render: function(){
        var type = this.props.type;
        var html = null;
        var display_name = null;
        var layer = parseInt(this.props.height)+34;
        if(this.props.permission === 'eformDev'){
            display_name = (
                <div style={{position: 'absolute', top: -30, left: 0, backgroundColor: 'green', color: 'white', padding: 5}}>
                    {this.props.name}
                </div>
            )
        }
        switch(type){
            case 'eform_input_signature':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        <div style={{position: 'absolute', height: layer, top: 0, left: 0, width: '100%', zIndex: -1}} ref="layer"/>
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <a className="btn btn-primary btn-sm" onClick={this._onReset} ref="reset">
                                    Reset
                                </a>
                                <div ref="signature" style={{background: '#EEEEEE', height: this.props.height}}
                                    id={this.props.refTemp}/>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
    }
})