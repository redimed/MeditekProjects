module.exports = React.createClass({
    value: 'never',
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
        return this.props.value;
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
                            <input type="radio" className="icheck" name="yes" ref="yes"
                                value="yes"/>
                            &nbsp;
                            Yes
                        </label>
                        <label>
                            <input type="radio" className="icheck" name="yes" ref="no"
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