class ListField extends React.Component{
    constructor(){
        super()
        this.state = {
            list: Immutable.fromJS([
                {code: 'label', name: 'Seperate Label'},
                {code: 'itlh', name: 'Input Text with Label Horizontal'},
                {code: 'idlh', name: 'Input Date with Label Horizontal'},
                {code: 'tlh', name: 'Textarea with Label Horizontal'},
                {code: 'clh', name: 'Checkbox with Label Horizontal'},
                {code: 'table', name: 'Table'}
            ])
        }
    }
    _onSelectItem(item){
        swal({
            title: 'Are you sure?',
            text: 'You will select field: '+item.get('name'),
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            this.props.onSelectItem(item)
        }.bind(this))
    }
	render(){
        const {list} = this.state
		return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="list-group">
                        {
                            list.map((item,index)=>{
                                return (
                                    <li className="list-group-item bg-blue bg-font-blue" key={index} style={{cursor:'pointer'}}
                                        onClick={this._onSelectItem.bind(this,item)}>
                                        {item.get('name')}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
		)
	}
}

React.propTypes = {
    onSelectItem: React.PropTypes.func.isRequired
}

export default ListField