module.exports = React.createClass({
    value: 'no',
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
        preCal: React.PropTypes.string
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
        $(this.refs.input).iCheck({
            labelHover: false,
            cursor: true,
            checkboxClass: 'icheckbox_square-green'
        })
        $(this.refs.input).on('ifChecked', function(event){
            self.value = 'yes';
        })
        $(this.refs.input).on('ifUnchecked', function(event){
            self.value = 'no';
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
        if(this.props.permission === 'eformDev'){
            $(this.refs.input).prop('disabled', true);
        }
    },
    isChecked: function(){
        return $(this.refs.input).prop('checked');
    },
    setChecked: function(checked){
        if(checked)
            $(this.refs.input).iCheck('check');
        else{
             $(this.refs.input).iCheck('uncheck');
        }
    },
    setValue: function(checked){
        if(checked === 'yes')
            $(this.refs.input).iCheck('check');
        else
           $(this.refs.input).iCheck('uncheck'); 
    },
    getValue: function(){
        return this.props.value;
    },
    getValueTable: function(){
        return this.value;
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
    getPreCal: function(){
        return this.props.preCal;
    },
    render: function(){
        var type = this.props.type
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
                    <input type="checkbox" className="icheck" name={this.props.name} id={this.props.id} ref="input"/>
                )
                break;
            case 'eform_input_check_checkbox':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <div className="icheck-inline">
                                    <label>
                                        <input type="checkbox" className="icheck" name={this.props.name} ref="input" title={this.props.name}/>
                                        &nbsp;
                                        {this.props.label}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 'c':
                html = (
                    <input type="checkbox" className="icheck" ref="input"/>
                )
                break;
        }
        return html
    }
})