class Pagebar extends React.Component{
	_onAddNewSection(){
		swal({
			title: 'Are you sure?',
			text: 'You will create new Section for this E-Form',
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			allowOutsideClick: true
		}, function(){
			this.props.onAddNewSection();
		}.bind(this))
	}
	_onSaveForm(){
		swal({
			title: 'Are you sure?',
			text: 'You will save this form !!!',
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			allowOutsideClick: false,
			showLoaderOnConfirm: true
		}, function(){
			this.props.onSaveForm();
		}.bind(this))
	}
	render(){
		return (
			<div className="page-bar">
				<ul className="page-breadcrumb">
                    <li>
                        <a>Dashboard</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>E-Form</span>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
                    	<button type="button" className="btn green btn-sm" onClick={this._onAddNewSection.bind(this)}>
                    		<i className="fa fa-plus"></i>&nbsp;
                    		Add New Section
						</button>
						&nbsp;
						<button type="button" className="btn green btn-sm" onClick={this._onSaveForm.bind(this)}>
                    		<i className="fa fa-save"></i>&nbsp;
                    		Save Form
						</button>
                    </div>
                </div>
			</div>
		)
	}
}

Pagebar.propTypes = {
	onAddNewSection: React.PropTypes.func.isRequired,
	onSaveForm: React.PropTypes.func.isRequired
}

export default Pagebar