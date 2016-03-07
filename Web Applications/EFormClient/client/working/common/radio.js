module.exports = React.createClass({
    value: '',
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
        this.value = this.props.value;
        $(this.refs.input).iCheck({
            labelHover: false,
            cursor: true,
            radioClass: 'iradio_square-green'
        })
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) {                    
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
                }.bind(this)
            })
        }
    },
    setChecked: function(){
        $(this.refs.input).iCheck('check');
    },
    setValue: function(value){
        this.value = value;
        $(this.refs.input).val(value);
    },
    isChecked: function(){
        return $(this.refs.input).prop('checked');
    },
    getValue: function(){
        return this.props.value;
    },
    getName: function(){
        return this.props.name;
    },
    getLabel: function(){
        return this.props.label;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
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
            case 'default':
                html = (
                    <input type="radio" className="icheck" name={this.props.name} id={this.props.id} ref="input"/>
                )
                break;
            case 'eform_input_check_radio':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <div className="icheck-inline">
                                    <label>
                                        <input type="radio" className="icheck" name={this.props.name} ref="input" title={this.props.name}
                                            value={this.props.value}/>
                                        &nbsp;
                                        {this.props.label}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 'r':
                html = (
                    <input type="radio" className="icheck" ref="input"/>
                )
                break;
        }
        return html
    }
})