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
        this.value = this.props.value;
        $(this.refs.input).iCheck({
            labelHover: false,
            cursor: true,
            radioClass: 'iradio_square-green'
        })
        $(this.refs.input).on('ifChecked', function(event){
            if(typeof self.props.onChange !== 'undefined')
                self.props.onChange(self.value);
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
    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.input).prop('disabled', true);
        }else{
            $(this.refs.input).css('display', 'none');
        }
    },
    isChecked: function(){
        return $(this.refs.input).prop('checked');
    },
    onCount: function(countRef){
        var self = this;
        $('input[name='+this.props.name+']').on('ifClicked', function(){
            var count = $('#'+countRef).val() || 0;
            if(self.value !== this.value){
                if(count > 0)
                    count--; 
            }else{
                count++;
            }
            $('#'+countRef).val(count);
        })
    },
    onBelongsGroup: function(group){
        var self = this;
        $('input[name='+group+']').on('ifClicked', function(event){
            var value = event.target.value;
            if(isNaN(value))
                value = 0;
            var radios = $('input[name='+self.props.name+']');
            radios.filter(function(){
                var id = $(this).attr('id');
                var id_value = $('#'+id).val();
                if(parseInt(value) === parseInt(id_value)){
                    $('#'+id).iCheck('check');
                }else{
                    $('#'+id).iCheck('uncheck');
                }
            })
        })
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
        switch(type){
            case 'default':
                html = (
                    <input type="radio" className="icheck" name={this.props.name} id={this.props.id} ref="input" value={this.props.value}/>
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
                                            value={this.props.value} id={this.props.refTemp}/>
                                        &nbsp;
                                        {this.props.label}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
        }
        return html
    }
})