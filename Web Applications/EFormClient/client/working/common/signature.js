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
        onRightClickItem: React.PropTypes.func
    },
    getDefaultProps: function(){
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12'
        }
    },
    componentDidMount: function(){
        var self = this;
        setTimeout(function(){
            $(self.refs.signature).jSignature();
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
        valueArr = value.join(",");
        if(valueArr !== "image/jsignature;base30,"){
            if(typeof $(this.refs.signature).jSignature !== 'undefined')
                $(this.refs.signature).jSignature("setData", "data:" + value.join(","));
        }
    },
    getValue: function(){
        return $(this.refs.signature).jSignature("getData", "base30")
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
    _onReset: function(){
        $(this.refs.signature).jSignature("reset");
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
        switch(type){
            case 'eform_input_signature':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <a className="btn btn-primary btn-sm" onClick={this._onReset}>
                                    Reset
                                </a>
                                <div ref="signature" style={{background: '#EEEEEE'}}/>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
    }
})