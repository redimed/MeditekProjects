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
    },
    setValue: function(value){
        this.value = value;
        if(this.value === 'yes')
            $(this.refs.input).iCheck('check');
        else
            $(this.refs.input).iCheck('uncheck');
    },
    getValue: function(){
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
    render: function(){
        var type = this.props.type
        var html = null
        switch(type){
            case 'default':
                html = (
                    <input type="checkbox" className="icheck" name={this.props.name} id={this.props.id} ref="input"/>
                )
                break;
            case 'clh':
                html = (
                    <div className={"dragula col-xs-"+this.props.size} ref="group">
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