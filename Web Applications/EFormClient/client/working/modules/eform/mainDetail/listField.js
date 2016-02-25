module.exports = React.createClass({
    propTypes: {
        onSelectItem: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            list: Immutable.fromJS([
                {code: 'label', name: 'Label'},
                {code: 'labelh', name: 'Label HTML'},
                {code: 'itnl', name: 'Input Text'},
                {code: 'idnl', name: 'Input Date'},
                {code: 'tnl', name: 'Textarea'},
                {code: 'clh', name: 'Checkbox with Label Horizontal'},
                {code: 'table', name: 'Table'},
                {code: 'rlh', name: 'Radio with Label Horizontal'},
                {code: 'break', name: 'Break row'}
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