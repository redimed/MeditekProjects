var history = ReactRouter.hashHistory;
var Config = require('config');
var Modal = require('common/modal');
var Dropdown = require('common/dropdown');

var printTypes = [
    {code: 'itext', name: 'IText Report'},
    {code: 'jasper', name: 'Jasper Report'}
];
module.exports = React.createClass({
	propTypes: {
	   onSaveForm: React.PropTypes.func,
                onPrintForm: React.PropTypes.func
	},
            appointmentUID: null,
            patientUID: null,
            userUID: null,
            componentDidMount: function(){
                this.refs.dropdownPrint.setValue(printTypes[0].code);
            },
            _onOpenPrintForm: function(){
                this.refs.modalPrintTypes.show();
            },
            _onPrintForm: function(){
                var dropdown = this.refs.dropdownPrint.getValue();
                this.props.onPrintForm(dropdown);
            },
	_onSaveForm: function(){
                this.props.onSaveForm();
	},
	render: function(){
	   return (
                   <div className="page-bar">
                        <Modal ref="modalPrintTypes">
                            <div className="header">
                                    <h4>Select Print Type</h4>
                            </div>
                            <div className="content">
                                <div className="col-md-12">
                                    <form>
                                        <div className="form-body">
                                            <div className="form-group">
                                                <Dropdown list={printTypes} code="code" name="name" ref="dropdownPrint"/>
                                            </div>
                                            <div className="form-group" style={{float:'right'}}>
                                                <button type="button" className="btn btn-primary" onClick={this._onPrintForm}>Print</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal>
                        <div className="page-toolbar">
                            <div className="pull-right">
        		      <button type="button" className="btn green btn-sm" onClick={this._onSaveForm}>
                                    <i className="fa fa-save"></i>&nbsp;
                                    Save Form
        		      </button>
                                &nbsp;
                                <button type="button" className="btn green btn-sm" onClick={this._onOpenPrintForm}>
                                    <i className="fa fa-print"></i>&nbsp;
                                    Print PDF Form
                                </button>
                            </div>
                        </div>
                    </div>
	   )
            }
})