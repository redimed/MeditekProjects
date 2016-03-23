var ComponentPageBar = require('modules/eform/eformGroup/pageBar');
var ComponentFormList = require('modules/eform/eformGroup/formList');
var ComponentFormCreate = require('modules/eform/eformGroup/formCreate');
var ComponentFormUpdate = require('modules/eform/eformGroup/formUpdate');
var CommonModal = require('common/modal');
var EFormService = require('modules/eform/services');
var Config = require('config');

module.exports = React.createClass({
    userUID: null,
    componentDidMount: function(){
            var locationParams = Config.parseQueryString(window.location.href);
            this.userUID = locationParams.userUID;
            this.refs.formCreate.setUserUID(this.userUID);
            this.refs.formUpdate.setUserUID(this.userUID);
            this.refs.formList.setUserUID(this.userUID);
    },
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
            EFormService.eformGroupRemove(data)
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
                <CommonModal ref="modalAddForm">
                    <div className="header">
                            <h4>Modal Add Form</h4>
                    </div>
                    <div className="content">
                        <ComponentFormCreate ref="formCreate"
                                        onSave={this._onComponentFormCreateSave}
                                        onCloseModal={function(){this.refs.modalAddForm.hide()}.bind(this)}/>
                    </div>
                </CommonModal>
                <CommonModal ref="modalUpdateForm" portal="modalUpdateForm">
                    <div className="header">
                            <h4>Modal Update Form</h4>
                    </div>
                    <div className="content">
                           <ComponentFormUpdate ref="formUpdate"
                              onSave={this._onComponentFormUpdateSave}
                                         onCloseModal={function(){this.refs.modalUpdateForm.hide()}.bind(this)}/>
                    </div>
                </CommonModal>
                     <ComponentPageBar 
                        ref="componentPageBar"
                        onAddNewForm={this._onComponentPageBarAddNewForm}/>
                     <h3 className="page-title"> E-Form Template
                        <small> List all template exists</small>
                    </h3>
                    <ComponentFormList ref="formList"
                       onClickUpdate={this._onComponentFormListUpdate}
                       onClickRemove={this._onComponentFormListRemove}/>
            </div>
        )
    }
})