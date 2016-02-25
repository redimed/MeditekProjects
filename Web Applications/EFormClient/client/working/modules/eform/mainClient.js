var CommonModal = require('common/modal');
var ComponentPageBar = require('modules/eform/mainClient/pageBar');
var ComponentFormList = require('modules/eform/mainClient/formList');
var ComponentFormClientList = require('modules/eform/mainClient/formClientList');
var history = ReactRouter.hashHistory;
var EFormService = require('modules/eform/services');
var Config = require('config');

module.exports = React.createClass({
    appointmentUID: null,
    patientUID: null,
    parseQueryString: function(location){
        var params = location.split('?');
        var str = params[1];
        var objURL = {};

        str.replace(
            new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
            function( $0, $1, $2, $3 ){
                objURL[ $1 ] = $3;
            }
        );
        return objURL;
    },
    componentDidMount: function() {
        var locationParams = this.parseQueryString(window.location.href);
        this.appointmentUID = locationParams.appoinmentUID;
        this.patientUID = locationParams.patientUID;
        this.refs.formClientList.init(this.appointmentUID, this.patientUID);
    },
    _onComponentPageBarSelectForm: function() {
        this.refs.modalSelectForm.show();
    },
    _onComponentFormListSelect: function(item) {
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will select this form',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: true
        }, function() {
            self.refs.modalSelectForm.hide();
            swal("Success!", "Your can write form like you want!!!", "success");
            history.push('/eform/detail/appointment/' +self.appointmentUID+ '/patient/'+self.patientUID+'/form/'+item.ID);
        })
    },
    _onComponentFormClientListRemove: function(item) {
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will delete this form',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: true
        }, function() {
            EFormService.formClientRemove({ id: item.ID })
                .then(function() {
                    swal("Success!", "Your delete this form!!!", "success");
                    self.refs.formClientList.refresh();
                })
        })
    },
            _onComponentPageBarPrintForm: function(){
                    alert('sasaas');
            },
	render: function(){
		return (
			<div className="page-content">
				<CommonModal ref="modalSelectForm" portal="modalSelectForm">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Select a form</h4>
                    </div>
                    <div className="modal-body">
                        <ComponentFormList ref="formList" onSelect={this._onComponentFormListSelect}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" data-dismiss="modal" className="btn btn-default">Close</button>
                    </div>
                </CommonModal>
				<ComponentPageBar ref="pageBar"
                                                                onPrintForm={this._onComponentPageBarPrintForm}
					onSelectForm={this._onComponentPageBarSelectForm}/>
				<h3 className="page-title"> E-Form
                    <small> List all form exists in appointment</small>
                </h3>
                <ComponentFormClientList ref="formClientList"
                    onRemove={this._onComponentFormClientListRemove}/>
			</div>
		)
	}
})