module.exports = React.createClass({
    value: '',
    componentDidMount: function(){
        var self = this;
        $(this.refs.yes).iCheck({
            labelHover: false,
            cursor: true,
            radioClass: 'iradio_square-green'
        })
        $(this.refs.no).iCheck({
            labelHover: false,
            cursor: true,
            radioClass: 'iradio_square-green'
        })

        $(this.refs.yes).on('ifChecked', function(event){
            self.value = 'yes';
        });
        $(this.refs.no).on('ifChecked', function(event){
            self.value = 'no';
        });
    },
    getValue: function(){
        return this.value;
    },
    getType: function(){
        return this.props.type;
    },
    setValue: function(checked){
        if(checked === 'yes')
            $(this.refs.yes).iCheck('check');
        else
           $(this.refs.no).iCheck('check'); 
    },
    render: function(){
        return (
            <div className="form-group">
                <div className="col-xs-12">
                    <div className="icheck-inline">
                        <label>
                            <input type="radio" className="icheck" name={this.props.refTemp} ref="yes"
                                value="yes"/>
                            &nbsp;
                            Yes
                        </label>
                        <label>
                            <input type="radio" className="icheck" name={this.props.refTemp} ref="no"
                                value="no"/>
                            &nbsp;
                            No
                        </label>
                    </div>
                </div>
            </div>
        )
    }
})