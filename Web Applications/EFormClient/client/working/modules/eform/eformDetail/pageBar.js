var history = ReactRouter.hashHistory;
var Config = require('config');

module.exports = React.createClass({
	propTypes: {
	   onSaveForm: React.PropTypes.func,
                onPrintForm: React.PropTypes.func
	},
            appointmentUID: null,
            patientUID: null,
            userUID: null,
            init: function(params){
                this.appointmentUID = params.appointmentUID;
                this.patientUID = params.patientUID;
                this.userUID = params.userUID;
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
	render: function(){
	   return (
        	               <div className="page-bar">
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