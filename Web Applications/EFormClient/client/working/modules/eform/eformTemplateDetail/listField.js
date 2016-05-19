module.exports = React.createClass({
    countObj: {},
    propTypes: {
        onSelectItem: React.PropTypes.func,
        onCloseModal: React.PropTypes.func
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
                {code: 'eform_input_signature', name: 'E-Signature'},
                {code: 'eform_input_image_doctor', name: 'Image Doctor'},
                {code: 'dynamic_table', name: 'Dynamic Table'},
                {code: 'line_chart', name: 'Line Chart'},
                {code: 'eform_button_reload_doctor', name: 'Button Reload Doctor Info'}
            ])
        }
    },
    init: function(fields){
        var fields_js = fields.toJS();
        this.countObj = {};
        for(var i = 0; i< fields_js.length; i++)
        {
            this.countObj[fields_js[i].type] = (this.countObj[fields_js[i].type] || 0) + 1;
        }
        this.forceUpdate();
    },
    _onSelectItem: function(item){
        var self = this;
        this.countObj[item.get('code')] = (this.countObj[item.get('code')]||0) + 1;
        self.props.onSelectItem(item);
    },
    render: function(){
        return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="list-group">
                        {
                            this.state.list.map(function(item, index){
                                return (
                                    <li className="list-group-item bg-blue bg-hover-blue bg-font-blue" key={index} style={{cursor:'pointer'}}
                                        onClick={this._onSelectItem.bind(this,item)}>
                                        {item.get('name')}
                                        <span className="badge">{this.countObj[item.get('code')]?this.countObj[item.get('code')]:0}</span>
                                    </li>

                                )
                            }, this)
                        }
                    </ul>
                    <div className="form-body">
                        <div className="form-group" style={{float:'right'}}>
                            <button type="button" className="btn btn-default" onClick={this.props.onCloseModal}>Close</button>

                        </div>
                    </div>

                </div>
            </div>
        )   
    }
})
