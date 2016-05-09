var ComponentSection = require('modules/eform/eformTemplateDetail/section');
var EFormService = require('modules/eform/services');
var Config = require('config');
var ComponentPageBar = require('modules/eform/eformDetail/pageBar');
var History = ReactRouter.hashHistory;

module.exports = React.createClass({
    appointmentUID: null,
    patientUID: null,
    userUID: null,
    templateUID: null,
    formUID: null,
    signatureDoctor: null,
    EFormTemplate: null,
    getInitialState: function(){
        return {
            name: '',
            sections: Immutable.List(),
            history: []
        }
    },
    componentDidMount: function() {
        var locationParams = Config.parseQueryString(window.location.href);
        this.appointmentUID = locationParams.appointmentUID;
        this.patientUID = locationParams.patientUID;
        this.userUID = locationParams.userUID;
        this.templateUID = locationParams.templateUID;

        this._serverTemplateDetail();
    },
    _serverPreFormDetail: function(content){
        var self = this;
        EFormService.getUserRoles({UID: this.userUID})
        .then(function(responseRoles){
            EFormService.preFormDetail({UID: self.appointmentUID})
            .then(function(response){
                console.log(response)
                if(typeof response.data.Doctor !== 'undefined' && response.data.Doctor !== null)
                    self.signatureDoctor = response.data.Doctor.FileUpload;
                else
                    self.signatureDoctor = '';
                for(var section_index = 0; section_index < content.length; section_index++){
                    var section = content[section_index];
                    for(var row_index = 0; row_index < section.rows.length; row_index++){
                        var row = section.rows[row_index];
                        for(var field_index = 0; field_index < row.fields.length; field_index++){
                            var field = row.fields[field_index];
                            /* ROLES */
                            if(typeof field.roles !== 'undefined'){
                                var view_flag = false;
                                var edit_flag = false;
                                var view_option = field.roles.view.option;
                                for(var role_id = 0; role_id < responseRoles.roles.length; role_id++){
                                    var role = responseRoles.roles[role_id];
                                    /* VIEW */
                                    for(var role_field_id = 0; role_field_id < field.roles.view.list.length; role_field_id++){
                                        var field_role = field.roles.view.list[role_field_id];
                                        if(field_role.id === role.RoleId){
                                            if(field_role.value === 'yes'){
                                                view_flag = true;
                                                break;
                                            }
                                        }
                                    }
                                    /* END VIEW */
                                    /* EDIT */
                                    for(var role_field_id = 0; role_field_id < field.roles.edit.length; role_field_id++){
                                        var field_role = field.roles.edit[role_field_id];
                                        if(field_role.id === role.RoleId){
                                            if(field_role.value === 'yes'){
                                                edit_flag = true;
                                                break;
                                            }
                                        }
                                    }
                                    /* END EDIT */
                                }
                                if(!edit_flag)
                                    self.refs[section.ref].setDisplay(row.ref, field.ref, 'disable');
                                if(!view_flag)
                                    self.refs[section.ref].setDisplay(row.ref, field.ref, 'hidden');
                            }
                            /* END ROLES */
                            if(field.type === 'eform_input_image_doctor'){
                                self.refs[section.ref].setValue(row.ref, field.ref, self.signatureDoctor);
                            }
                            var preCalArray = [];
                            if(typeof field.preCal !== 'undefined'){
                                preCalArray = field.preCal.split('|');
                            }
                            preCalArray.map(function(preCal){
                                /* CONCAT PREFIX */
                                if(Config.getPrefixField(preCal,'CONCAT') > -1){
                                    if(preCal !== ''){
                                        var preCalRes = Config.getArrayConcat(preCal);
                                        var value = '';
                                        preCalRes.map(function(preCalResItem){
                                            var preCalResItemArr = preCalResItem.split('.');
                                            var responseTemp = null;
                                            var preCalResItemTemp = '';
                                            if(preCalResItemArr.length > 1){
                                                responseTemp = response.data[preCalResItemArr[0]];
                                                preCalResItemTemp = preCalResItemArr[1];
                                            }else{
                                                responseTemp = response.data;
                                                preCalResItemTemp = preCalResItem;
                                            }
                                            for(var key in responseTemp){
                                                if(key === preCalResItemTemp){
                                                    if(Config.getPrefixField(field.type,'checkbox') > -1){
                                                        if(field.value === responseTemp[key]){
                                                            value = 'yes';
                                                        }
                                                    }
                                                    else if(Config.getPrefixField(field.type,'radio') > -1){
                                                        if(field.value === responseTemp[key]){
                                                            value = 'yes';
                                                        }
                                                    }else{
                                                        if(responseTemp[key] !== null)
                                                            value += responseTemp[key]+' ';
                                                    }
                                                    break;
                                                }
                                            }
                                        })
                                        self.refs[section.ref].setValue(row.ref, field.ref, value);
                                    }
                                }
                                /* END CONCAT PREFIX */
                                /* DEFAULT PREFIX */
                                if(Config.getPrefixField(preCal,'DEFAULT') > -1){
                                    if(preCal !== ''){
                                        var preCalRes = Config.getArrayDefault(preCal);
                                        var value = preCalRes[0];

                                        if(value === 'TODAY'){
                                            self.refs[section.ref].setValue(row.ref, field.ref, moment().format('YYYY-MM-DD HH:mm:ss'));
                                        }
                                    }
                                }
                                /* END DEFAULT PREFIX */
                            })//end pre cal array
                        }
                    }
                }//end for
                self._checkServerEFormDetail();
            })
        })
    },
    _checkServerEFormDetail: function(){
        var self = this;
        EFormService.eformCheckDetail({templateUID: this.templateUID, appointmentUID: this.appointmentUID})
        .then(function(response){
            if(response.data){
                self.formUID = response.data.UID;
                var EFormDataContent = JSON.parse(response.data.EFormData.FormData);
                var rowDynamicTable = {fields: []};
                var countRowDynamicTable = 0;
                var countFieldDynamicTable = 0;
                var currentRefDynamicTable = '';
                EFormDataContent.map(function(field, indexField){
                    var fieldRef = field.ref;
                    var fieldData = field.value;
                    var rowRef = field.refRow;
                    var sections = self.state.sections.toJS();
                    for(var i = 0; i < sections.length; i++){
                        var section = sections[i];
                        if(typeof field.refChild === 'undefined'){
                            if(Config.getPrefixField(field.type, 'radio') > -1 || Config.getPrefixField(field.type, 'checkbox') > -1){
                                self.refs[section.ref].setValueForRadio(rowRef, fieldRef, field.checked);
                            }else{
                                if(field.type === 'line_chart'){
                                    self.refs[section.ref].setValueForChart(rowRef, fieldRef, field, 'line');
                                }
                                else if(field.type !== 'eform_input_image_doctor'){
                                    self.refs[section.ref].setValue(rowRef, fieldRef, fieldData);
                                }
                            }
                        }else{
                            if(field.type === 'table'){
                                var fieldRefChild = field.refChild;
                                self.refs[section.ref].setValueForTable(rowRef, fieldRef, fieldRefChild, fieldData);
                            }else if(field.type === 'dynamic_table'){
                                var refRow = parseInt(field.refChild.split('_')[1]);
                                if(currentRefDynamicTable !== field.ref){
                                    if(currentRefDynamicTable !== null){
                                        rowDynamicTable = {fields: []};
                                        countRowDynamicTable = 0;
                                        countFieldDynamicTable = 0;
                                    }
                                    currentRefDynamicTable = field.ref;
                                }
                                    
                                if(countRowDynamicTable <= refRow){
                                    rowDynamicTable.fields.push(field);
                                    if(field.cols-1 > countFieldDynamicTable){
                                        countFieldDynamicTable++;
                                    }
                                    else{
                                        countFieldDynamicTable = 0;
                                        self.refs[section.ref].addRowForDynamicTable(rowDynamicTable);
                                    }
                                    if(refRow > countRowDynamicTable){
                                        rowDynamicTable.fields = [];
                                        rowDynamicTable.fields.push(field);
                                        countRowDynamicTable++;
                                    }
                                }
                            }
                        }
                    }
                })
            }
        })
    },
    _serverTemplateDetail: function(){
        var self = this;
        EFormService.eformTemplateDetail({uid: this.templateUID})
        .then(function(response){
            var EFormTemplate = self.EFormTemplate = response.data;
            var content = JSON.parse(response.data.EFormTemplateData.TemplateData);

             EFormService.eformHistoryDetail({EFormTemplateUID: self.templateUID, PatientUID: self.patientUID})
            .then(function(result){
                self.setState(function(prevState){
                    return {
                        name: EFormTemplate.Name,
                        sections: Immutable.fromJS(content),
                        history: result.data.rows
                    }
                })
                self._serverPreFormDetail(content);
            })
        })
    },
    _onDetailSaveForm: function(){
        var self = this;
        var p = new Promise(function(resolve, reject){
            var templateUID = self.templateUID;
            var sections = self.state.sections.toJS();
            var fields = [];
            for(var i = 0; i < sections.length; i++){
                var section = sections[i];
                var sectionRef = section.ref;
                var tempFields = self.refs[sectionRef].getAllFieldValueWithValidation('form');
                tempFields.map(function(field, index){
                    fields.push(field);
                })
            }
            var content = JSON.stringify(fields);
            var appointmentUID = self.appointmentUID;

            if(self.formUID === null){
                EFormService.formSave({templateUID: self.templateUID, appointmentUID: appointmentUID, content: content, name: self.state.name, patientUID: self.patientUID, userUID: self.userUID})
                .then(function(){
                    resolve();
                    window.location.reload();
                })
            }else{
                EFormService.formUpdate({UID: self.formUID, content: content})
                .then(function(){
                    resolve();
                })
            }
        });
        return p;
    },
    _onComponentPageBarSaveForm: function(){
        this._onDetailSaveForm()
        .then(function(){
            window.location.reload();
        })
    },
    _onComponentPageBarPrintForm: function(){
        var self = this;
        var sections = self.state.sections.toJS();
        var fields = [];
        for(var i = 0; i < sections.length; i++){
            var section = sections[i];
            var sectionRef = section.ref;
            var tempFields = self.refs[sectionRef].getAllFieldValueWithValidation('print');
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }

        var data = {
            printMethod: self.EFormTemplate.PrintType,
            data: fields,
            templateUID: self.templateUID
        }

        EFormService.createPDFForm(data)
        .then(function(response){
            var fileName = 'report_'+moment().format('X');
            var blob = new Blob([response], {
                type: 'application/pdf'
            });
            saveAs(blob, fileName);
        }, function(error){

        })
    },
    _onGoToHistory: function(history){
        var appointmentUID = history.Appointments[0].UID;
        window.location.href = '/#/eform/detail?appointmentUID='+appointmentUID+'&patientUID='+this.patientUID+'&templateUID='+this.templateUID+'&userUID='+this.userUID;
        window.location.reload();
    },
    _onComponentSectionSaveTableDynamicRow: function(codeSection, codeRow, codeField, row){
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'rows'], 
                    val => val.push(Immutable.fromJS(row)))
            }
        })
    },
    _onComponentSectionEditTableDynamicRow: function(codeSection, codeRow, codeField, position, row){        
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.updateIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'rows', position], 
                    val => Immutable.fromJS(row))
            }
        })
    },
    _onComponentSectionRemoveTableDynamicRow: function(codeSection, codeRow, codeField, position){
        this.setState(function(prevState) {
            return {
                sections: prevState.sections.deleteIn([codeSection, 'rows', codeRow, 'fields', codeField, 'content', 'rows', position])
            }
        })
        swal("Success!", "Deleted", "success");
    },
    render: function(){
        return (
            <div className="page-content">
                <ComponentPageBar ref="pageBar"
                        onSaveForm={this._onComponentPageBarSaveForm}
                        onPrintForm={this._onComponentPageBarPrintForm}/>
                <h3 className="page-title">{this.state.name}</h3>
                <div className="row">
                    <div className="col-md-9">
                        {
                            this.state.sections.map(function(section, index){
                                var viewType = section.get('viewType');
                                if(viewType !== 'hide')
                                    return <ComponentSection key={index}
                                        ref={section.get('ref')}
                                        refTemp={section.get('ref')}
                                        viewType={section.get('viewType')}
                                        moduleID={section.get('moduleID') | ''}
                                        key={index}
                                        code={index}
                                        type="section"
                                        permission="normal"
                                        onSaveTableDynamicRow={this._onComponentSectionSaveTableDynamicRow}
                                        onEditTableDynamicRow={this._onComponentSectionEditTableDynamicRow}
                                        onRemoveTableDynamicRow={this._onComponentSectionRemoveTableDynamicRow}
                                        rows={section.get('rows')}
                                        name={section.get('name')}/>
                                else
                                    return null;
                            }, this)
                        }
                    </div>
                    <div className="col-lg-3 col-md-12" style={{position: 'fixed', top: 40, right: 0}}>
                        <div className="portlet portlet-fit box blue">
                            <div className="portlet-title">
                                <div className="caption">
                                    <span className="caption-subject bold uppercase">
                                        <i className="icon-speedometer"></i> History
                                    </span>
                                </div>
                                <div className="tools">
                                    <a href="javascript:;" className="collapse"> </a>
                                </div>
                            </div>
                            <div className="portlet-body">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th width="1">#</th>
                                            <th>Code</th>
                                            <th>Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.history.map(function(h, index){
                                                var appointment = h.Appointments[0];
                                                var backgroundColor = 'none';
                                                var textColor = 'inherit';
                                                if(appointment.UID === this.appointmentUID){
                                                    backgroundColor = 'green';
                                                    textColor = 'white';
                                                }
                                                return (
                                                    <tr key={index} onClick={this._onGoToHistory.bind(this, h)}
                                                        style={{backgroundColor: backgroundColor, color: textColor, cursor: 'pointer'}}>
                                                        <td>{index+1}</td>
                                                        <td>{appointment.Code}</td>
                                                        <td>{moment(h.Appointments[0].CreatedDate).format('DD/MM/YYYY')}</td>
                                                    </tr>
                                                )
                                            }, this)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})