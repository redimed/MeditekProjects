var history = ReactRouter.hashHistory;

module.exports = React.createClass({
	propTypes: {
		onSaveForm: React.PropTypes.func
	},
            appointmentId: '',
            init: function(params){
                this.appointmentId = params.appointmentId;
            },
            _onPrintForm: function(){
                    swal({
                        title: 'Are you sure?',
                        text: 'You will save this form !!!',
                        type: 'warning',
                        showCancelButton: true,
                        closeOnConfirm: false,
                        allowOutsideClick: false,
                        showLoaderOnConfirm: true
                    }, function(){
                        this.props.onPrintForm();
                    }.bind(this))
            },
	_onSaveForm: function(){
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
	},
            _goToHome: function(){
                history.push('/eform?appoinmentUID='+this.appointmentId);
            },
	render: function(){
		return (
			<div className="page-bar">
			     <ul className="page-breadcrumb">
                                                    <li>
                                                            <a onClick={this._goToHome}>Home</a>
                                                    <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>E-Form</span>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
						<button type="button" className="btn green btn-sm" onClick={this._onSaveForm}>
                    		<i className="fa fa-save"></i>&nbsp;
                    		Save Form
						</button>
                                        &nbsp;
                                        <button type="button" className="btn green btn-sm" onClick={this._onPrintForm}>
                                        <i className="fa fa-print"></i>&nbsp;
                                        Print PDF Form
                                    </button>
                    </div>
                </div>
			</div>
		)
	}
})