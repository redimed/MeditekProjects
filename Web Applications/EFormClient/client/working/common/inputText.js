module.exports = React.createClass({
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
        labelPrefix: React.PropTypes.string,
        labelSuffix: React.PropTypes.string
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
    },
    componentWillReceiveProps: function(nextProps){
        $(this.refs.input).val(nextProps.defaultValue);
    },
    setValue: function(value){
        $(this.refs.input).val(value)
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
    getRoles: function(){
        return this.props.roles;
    },
    getLabelPrefix: function() {
        return this.props.labelPrefix;
    },
    getLabelSuffix: function() {
        return this.props.labelSuffix;
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
        var labelStyle = {
            border: 'none',
            color: '#666'
        }
        switch(type){
            case 'default':
                html = (
                    <input type="text" className={this.props.className} ref="input" placeholder={this.props.placeholder}
                        defaultValue={this.props.defaultValue} style={this.props.style}
                        onBlur={this.props.onBlur} onChange={this.props.onChange}/>
                )
                break;
            case 'it':
                html = (
                    <input type="text" className="form-control" ref="input"/>
                )
                break;
            {/*case 'eform_input_text':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <input type="text" className={this.props.className} ref="input" placeholder={this.props.placeholder}/>
                            </div>
                        </div>
                    </div>
                )*/}
            case 'eform_input_text':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <div className="input-group">
                                    <span className="input-group-addon" style={labelStyle}>{this.props.labelPrefix}</span>
                                    <input type="text" className={this.props.className} ref="input" placeholder={this.props.placeholder}/>
                                    <span className="input-group-addon" style={labelStyle}>{this.props.labelSuffix}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
	}
})