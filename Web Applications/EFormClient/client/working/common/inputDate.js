var Config = require('config');

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
        $(this.refs.input).datepicker({
            autoclose: !0,
            format: 'dd/mm/yyyy',
            clearBtn:true,
        }).on('changeDate',function() {
            if(typeof self.props.onChange !== 'undefined'){
                self.props.onChange();
            }
        });
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
    setValue: function(value){
        if(value.indexOf('+') > -1)
            value = moment(value).format('DD/MM/YYYY');
        $(this.refs.input).datepicker("update", value);
    },
    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.input).attr('disabled', true);
        }else{
            $(this.refs.input).css('display', 'none');
        }
    },
    getValue: function(){
        var value = $(this.refs.input).val();
        return Config.getDateTimeZone(value);
    },
    getValuePrint: function(){
        var value = $(this.refs.input).val();
        console.log(value);
        return value;
    },
    getText: function(){
        var value = $(this.refs.input).val();
        return value;
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
                    <input type="text" className={this.props.className} name={this.props.name} ref="input" placeholder={this.props.placeholder}/>
                )
                break;
            case 'eform_input_date':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <input title={this.props.name} type="text" className={this.props.className} style={inputStyle} name={this.props.name} ref="input" placeholder={this.props.placeholder}
                                    id={this.props.refTemp} onDoubleClick = {this.selection}/>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 'd':
                html = (
                    <input type="text" className={this.props.className} style={inputStyle} name={this.props.name} ref="input" placeholder={this.props.placeholder}
                        id={this.props.refTemp}/>
                )
                break;
        }
        return html;
    }
})
