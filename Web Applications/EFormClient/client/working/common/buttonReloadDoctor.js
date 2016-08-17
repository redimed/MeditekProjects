module.exports = React.createClass({
    value: '',
    propTypes: {
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        refTemp: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
        permission: React.PropTypes.string,
        preCal: React.PropTypes.string,
        handleReloadDoctor: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '1'
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
            $(this.refs.button).prop('disabled', true);
        }
        if(typeof this.props.defaultValue !== 'undefined'){
            $(this.refs.button).val(this.props.defaultValue);
        }
        $(this.refs.button).on('change', function(event){
            if(typeof self.props.onChange !== 'undefined'){
                self.props.onChange();
            }
        })
        $(this.refs.button).on('keypress',function(event){
            if(typeof self.props.onKeyPress !== 'undefined'){
                self.props.onKeyPress(event);
            }
        })
    },
    componentWillReceiveProps: function(nextProps){
        $(this.refs.button).val(nextProps.defaultValue);
    },

    setValue: function(value){
        self.value = value;
        $(this.refs.button).val(value).change();
    },
    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.button).attr('disabled', true);
        }else{
            $(this.refs.button).css('display', 'none');
        }
    },
    getValue: function(){
        return $(this.refs.button).val()
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
        html = (
            <div className={"dragField col-xs-"+this.props.size} ref="group">
                {display_name}
                <div className="form-group" id={this.props.groupId}>
                    <div className="col-xs-12">
                        <a type="submit" className="btn green btn-sm" ref="button" onClick={this.props.handleReloadDoctor}>Reload Doctor</a>
                    </div>
                </div>
            </div>
        )
        return html;
    }
})
