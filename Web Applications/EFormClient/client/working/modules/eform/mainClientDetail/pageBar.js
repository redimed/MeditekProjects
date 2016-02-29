var history = ReactRouter.hashHistory;
var Config = require('config');

module.exports = React.createClass({
	propTypes: {
		onSaveForm: React.PropTypes.func,
                        onPrintForm: React.PropTypes.func
	},
            appointmentId: '',
            patientId: '',
            userId: '',
            init: function(params){
                this.appointmentId = params.appointmentId;
                this.patientId = params.patientId;
                this.userId = params.userId;
            },
            _onPrintForm: function(){
                var self = this;
                    swal({
                        title: 'Are you sure?',
                        text: 'You will save this form !!!',
                        type: 'warning',
                        showCancelButton: true,
                        closeOnConfirm: false,
                        allowOutsideClick: false,
                        showLoaderOnConfirm: true
                    }, function(){
                        self.props.onPrintForm();
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
                history.push(Config.getParamsIframe(this.appointmentId, this.patientId, this.userId));
            },
	render: function(){
		return (
			<div className="page-bar">
			     <ul className="page-breadcrumb">
                                                    <li>
                                                            <a onClick={this._goToHome}>List EForm</a>
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