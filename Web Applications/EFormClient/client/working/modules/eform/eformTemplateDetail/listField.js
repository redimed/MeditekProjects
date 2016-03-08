module.exports = React.createClass({
    propTypes: {
        onSelectItem: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            list: Immutable.fromJS([
                {code: 'eform_input_check_label', name: 'Label'},
                {code: 'eform_input_check_label_html', name: 'Label HTML'},
                {code: 'eform_input_text', name: 'Input Text'},
                {code: 'eform_input_date', name: 'Input Date'},
                {code: 'eform_input_textarea', name: 'Textarea'},
                {code: 'eform_input_check_checkbox', name: 'Checkbox'},
                {code: 'eform_input_check_radio', name: 'Radio'},
                {code: 'table', name: 'Table'},
                {code: 'eform_input_signature', name: 'E-Signature'}
            ])
        }
    },
    _onSelectItem: function(item){
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will select field: '+item.get('name'),
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            self.props.onSelectItem(item)
        })
    },
    render: function(){
        return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="list-group">
                        {
                            this.state.list.map(function(item, index){
                                return (
                                    <li className="list-group-item bg-blue bg-font-blue" key={index} style={{cursor:'pointer'}}
                                        onClick={this._onSelectItem.bind(this,item)}>
                                        {item.get('name')}
                                    </li>
                                )
                            }, this)
                        }
                    </ul>
                </div>
            </div>
        )   
    }
})