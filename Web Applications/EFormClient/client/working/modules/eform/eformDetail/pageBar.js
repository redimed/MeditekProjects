var history = ReactRouter.hashHistory;
var Config = require('config');
var Modal = require('common/modal');
var Dropdown = require('common/dropdown');

module.exports = React.createClass({
	propTypes: {
	   onSaveForm: React.PropTypes.func,
                onPrintForm: React.PropTypes.func
	},
            appointmentUID: null,
            patientUID: null,
            userUID: null,
            componentDidMount: function(){
            },
            _onPrintForm: function(){
                this.props.onPrintForm();
            },
	_onSaveForm: function(){
                this.props.onSaveForm();
	},
	render: function(){
	   return (
                   <div className="page-bar" style={{position: 'fixed', top: 0, right: 0}}>
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