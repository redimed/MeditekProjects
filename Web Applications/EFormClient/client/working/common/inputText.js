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
    onSum: function(sumRef){
        var self = this;
        $(this.refs.input).on('change', function(event){
            var sumValue = $('#'+sumRef).val() || 0;
            self.value = $.isNumeric(self.value)?self.value:0;
            console.log(self.value);
            if($.isNumeric(event.target.value)){
                if(parseFloat(sumValue) >= parseFloat(self.value))
                    sumValue = parseFloat(sumValue)-parseFloat(self.value)+parseFloat(event.target.value);
            }else{
                sumValue = parseFloat(sumValue)-parseFloat(self.value);
            }
            $('#'+sumRef).val(sumValue).change();
            if(typeof self.props.onChange !== 'undefined'){
                self.props.onChange();
            }
            self.value = event.target.value;
        })
    },
    onBelongsGroup: function(group){
        var self = this;
        $('input[name='+group+']').on('ifClicked', function(event){
            var value = event.target.value;
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
        var labelPrefixStyle = {
            border: 'none',
            color: '#666',
            paddingLeft: '1px',
            paddingRight:'5px'
        }
        var labelSuffixStyle = {
            border: 'none',
            color: '#666',
            paddingLeft: '5px',
            paddingRight:'1px'
        }
        var inputStyle = {
            paddingLeft: '1px',
            paddingRight:'1px'
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
                                {
                                    this.props.labelPrefix || this.props.labelSuffix?
                                    <div className="input-group">
                                        {this.props.labelPrefix?
                                            <span className="input-group-addon" style={labelPrefixStyle}>{this.props.labelPrefix}</span>
                                            :null
                                        }

                                        <input type="text" className={this.props.className} style={inputStyle} ref="input" placeholder={this.props.placeholder} id={this.props.refTemp}/>
                                        {this.props.labelSuffix?
                                            <span className="input-group-addon" style={labelSuffixStyle}>{this.props.labelSuffix}</span>
                                            :null
                                        }

                                    </div>
                                    :<input type="text" className={this.props.className} style={inputStyle} ref="input" placeholder={this.props.placeholder} id={this.props.refTemp}/>
                                }

                            </div>
                        </div>
                    </div>
                )
        }
        return html;
	}
})