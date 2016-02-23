var ComponentPageBar = require('modules/eform/main/pageBar');
var ComponentFormList = require('modules/eform/main/formList');
var ComponentFormCreate = require('modules/eform/main/formCreate');
var ComponentFormUpdate = require('modules/eform/main/formUpdate');
var CommonModal = require('common/modal');
var EFormService = require('modules/eform/services');

module.exports = React.createClass({
	_onComponentPageBarAddNewForm: function(){
		this.refs.modalAddForm.show();
	},
	_onComponentFormCreateSave: function(){
		this.refs.modalAddForm.hide();
		this.refs.formList.refresh();
		swal("Success!", "Your e-form has been created.", "success");
	},
	_onComponentFormListUpdate: function(item){
		this.refs.modalUpdateForm.show();
		this.refs.formUpdate.init(item);
	},
	_onComponentFormListRemove: function(item){
		this._serverFormRemove({id: item.ID});
	},
	_serverFormRemove: function(data){
		var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will remove this eform',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true,
            showLoaderOnConfirm: true
        }, function(){
            EFormService.formRemove(data)
            .then(function(response){
        		swal("Success!", "Your e-form has been removed.", "success");
        		self.refs.formList.refresh();
            })
        })
	},
	_onComponentFormUpdateSave: function(){
		this.refs.modalUpdateForm.hide();
		this.refs.formList.refresh();
		swal("Success!", "Your e-form has been updated.", "success");
	},
	render: function(){
		return (
			<div className="page-content">
				<CommonModal ref="modalAddForm" portal="modalAddForm">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Modal Add Form</h4>
                    </div>
                    <div className="modal-body">
                    	<ComponentFormCreate ref="formCreate"
                    		onSave={this._onComponentFormCreateSave}/>
                    </div>
                </CommonModal>
                <CommonModal ref="modalUpdateForm" portal="modalUpdateForm">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Modal Update Form</h4>
                    </div>
                    <div className="modal-body">
                    	<ComponentFormUpdate ref="formUpdate"
                    		onSave={this._onComponentFormUpdateSave}/>
                    </div>
                </CommonModal>
				<ComponentPageBar 
					ref="componentPageBar"
					onAddNewForm={this._onComponentPageBarAddNewForm}/>
				<h3 className="page-title"> E-Form
                    <small> List all form exists</small>
                </h3>
                <ComponentFormList ref="formList"
                	onClickUpdate={this._onComponentFormListUpdate}
                	onClickRemove={this._onComponentFormListRemove}/>
			</div>
		)
	}
})