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
    EFormID: null,
    EFormStatus: null,
    page: 1,
    maxPage : 0,
    allFields: [],
    calculation: [],
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
        if(typeof locationParams.page !== 'undefined')
            this.page = locationParams.page;
        this._serverTemplateDetail();
    },

    /**
     * Dan xuat tu ham _serverPreFormDetail
     */
    _handleReloadDoctor:function (sectionIm) {
        var section = sectionIm.toJS();
        var self = this;
        EFormService.preFormDetail({UID: self.appointmentUID, UserUID: self.userUID})
        .then(function(response){
            if(typeof response.data.Doctor !== 'undefined' && response.data.Doctor !== null)
                self.signatureDoctor = response.data.Doctor.FileUpload;
            else
                self.signatureDoctor = '';

            for(var row_index = 0; row_index < section.rows.length; row_index++){
                var row = section.rows[row_index];
                for(var field_index = 0; field_index < row.fields.length; field_index++){
                    var field = row.fields[field_index];

                    var preCalArray = [];
                    if(typeof field.preCal !== 'undefined'){
                        preCalArray = field.preCal.split('|');
                    }

                    preCalArray.map(function(preCal){
                        /* CONCAT PREFIX */
                        if(Config.getPrefixField(preCal,'CONCAT') > -1){
                            if(preCal !== ''){
                                var preCalRes = Config.getArrayPrecal(7, preCal);
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
                                    if(preCalResItemArr[0] === 'Doctor') {
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
                                        self.refs[section.ref].setValue(row.ref, field.ref, value);
                                    }
                                })
                            }
                        }
                        /* END CONCAT PREFIX */
                        /* DEFAULT PREFIX */
                        // tan comment begin
                        /*if(Config.getPrefixField(preCal,'DEFAULT') > -1){
                            if(preCal !== ''){
                                var preCalRes = Config.getArrayDefault(preCal);
                                var value = preCalRes[0];

                                if(value === 'TODAY'){
                                    if(typeof self.refs[section.ref] !== 'undefined')
                                        self.refs[section.ref].setValue(row.ref, field.ref, moment().format('YYYY-MM-DD HH:mm:ss'));
                                }
                            }
                        }*/
                        // tan comment end
                        /* END DEFAULT PREFIX */
                    })//end pre cal array
                }
            }
        })

    },

    _serverPreFormDetail: function(content){
        var self = this;
        var objRef = {};
        EFormService.getUserRoles({UID: this.userUID})
        .then(function(responseRoles){
            EFormService.preFormDetail({UID: self.appointmentUID, UserUID: self.userUID})
            .then(function(response){
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
                                if(!edit_flag && self.refs[section.ref])
                                    self.refs[section.ref].setDisplay(row.ref, field.ref, 'disable');
                                if(!view_flag && self.refs[section.ref])
                                    self.refs[section.ref].setDisplay(row.ref, field.ref, 'hidden');
                            }
                            /* END ROLES */
                            if(field.type === 'eform_input_image_doctor' && self.refs[section.ref]){
                                self.refs[section.ref].setValue(row.ref, field.ref, self.signatureDoctor);
                            }
                            var calArray = [];
                            if(typeof field.cal !== 'undefined')
                                calArray = field.cal.split('|');
                            calArray.map(function(cal){
                                /*SUMGROUP PREFIX */
                                /*if(Config.getPrefixField(cal, 'SGROUP') > -1){
                                    if(cal !== ''){
                                        var calRes = Config.getArrayPrecal(7, cal);
                                        calRes.map(function(minorRef){
                                            $('input[name='+minorRef+']').on('ifClicked', function(event){
                                                var total_value = 0;
                                                var name = $(this).attr('name');
                                                var first_value = event.target.value;
                                                if(isNaN(first_value))
                                                    first_value = 0;
                                                total_value = first_value;
                                                calRes.map(function(calName){
                                                    if(name !== calName){
                                                        var value = $('input[name='+calName+']:checked').val();
                                                        if(isNaN(value))
                                                            value = 0;
                                                        total_value = parseInt(total_value)+parseInt(value);
                                                    }
                                                })
                                                $('#'+field.ref).val(total_value);
                                            })
                                        })
                                    }
                                }*/
                                /*END SUMGROUP PREFIX */
                                /* SUMP PREFIX */
                                if(Config.getPrefixField(cal, 'SUMP(') > -1){
                                    if(cal !== ''){
                                        var calRes = Config.getArrayPrecal(5, cal);
                                        self.calculation.push({type: 'SUMP', section_ref: section.ref, row_ref: row.ref, field_ref: field.ref, cal: calRes});
                                    }
                                }
                                /* END SUMP PREFIX */
                                /* SUM PREFIX */
                                if(Config.getPrefixField(cal, 'SUM(') > -1){
                                    if(cal !== ''){
                                        var calRes = Config.getArrayPrecal(4, cal);
                                        calRes.map(function(minorRef){
                                            var splitMinorRef = minorRef.split('_');
                                            var rowRefField = 'row_'+splitMinorRef[1]+'_'+splitMinorRef[2];
                                            var sectionRefField = 'section_'+splitMinorRef[1];
                                            if(typeof self.refs[sectionRefField] !== 'undefined')
                                                self.refs[sectionRefField].preCalSum(rowRefField, minorRef, field.ref);
                                        })
                                    }
                                }
                                /* END SUM PREFIX */
                                /* COUNT PREFIX */
                                if(Config.getPrefixField(cal, 'COUNT') > -1){
                                    if(cal !== ''){
                                        var calRes = Config.getArrayPrecal(6, cal);
                                        calRes.map(function(minorRef){
                                            var splitMinorRef = minorRef.split('_');
                                            var rowRefField = 'row_'+splitMinorRef[1]+'_'+splitMinorRef[2];
                                            var sectionRefField = 'section_'+splitMinorRef[1];
                                            if(self.refs[sectionRefField])
                                                self.refs[sectionRefField].preCalCount(rowRefField, minorRef, field.ref);
                                        })
                                    }
                                }
                                /* END COUNT PREFIX */
                            })

                            var preCalArray = [];
                            if(typeof field.preCal !== 'undefined'){
                                preCalArray = field.preCal.split('|');
                            }
                            preCalArray.map(function(preCal){
                                /* EQUALP GROUP */
                                if(Config.getPrefixField(preCal, 'EQUALP(') > -1){
                                    if(preCal !== ''){
                                        var preCalRes = Config.getArrayPrecal(7, preCal);
                                        self.calculation.push({type: 'EQUALP', section_ref: section.ref, row_ref: row.ref, field_ref: field.ref, field: field, cal: preCalRes});
                                    }
                                }
                                /* END EQUALP GROUP */
                                /* BELONGS GROUP PREFIX */
                                if(Config.getPrefixField(preCal,'EQUAL(') > -1){
                                    if(preCal !== ''){
                                       var preCalRes = Config.getArrayPrecal(6, preCal);
                                       preCalRes = preCalRes[0];
                                        if(self.refs[section.ref])
                                            self.refs[section.ref].preCalBelongsGroup(row.ref, field.ref, preCalRes);
                                    }
                                }
                                /* END BELONGS GROUP PREFIX */
                                /* CONCAT PREFIX */
                                if(Config.getPrefixField(preCal,'CONCAT') > -1){
                                    if(preCal !== ''){
                                        var preCalRes = Config.getArrayPrecal(7, preCal);
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
                                        objRef[field.ref] = {refRow: row.ref, value: value};
                                        if(self.refs[section.ref]) {
                                            self.refs[section.ref].setValue(row.ref, field.ref, value);
                                        }

                                    }
                                }
                                /* END CONCAT PREFIX */
                                /* DEFAULT PREFIX */
                                if(Config.getPrefixField(preCal,'DEFAULT') > -1){
                                    if(preCal !== ''){
                                        var preCalRes = Config.getArrayDefault(preCal);
                                        var value = preCalRes[0];

                                        if(value === 'TODAY'){
                                            objRef[field.ref] = {refRow: row.ref, value: value};
                                            if(self.refs[section.ref])
                                                self.refs[section.ref].setValue(row.ref, field.ref, moment().format('YYYY-MM-DD HH:mm:ss'));
                                        }
                                    }
                                }
                                /* END DEFAULT PREFIX */
                            })//end pre cal array
                        }
                    }
                }//end for

                for(var i =0; i <self.allFields.length; i++) {
                    if(objRef[self.allFields[i].ref]) {
                        self.allFields[i].value = objRef[self.allFields[i].ref].value;
                    }
                }
                self._checkServerEFormDetail();
            })
        })
    },
    _checkServerEFormDetail: function(){
        var self = this;
        EFormService.eformCheckDetail({templateUID: this.templateUID, appointmentUID: this.appointmentUID})
        .then(function(response){
            if(response.data){
                self.EFormID = response.data.ID;
                self.EFormStatus = response.data.Status;
                self.formUID = response.data.UID;
                var tempData = JSON.parse(response.data.EFormData.TempData);
                self.allFields = self._mergeTwoObjects(self.allFields, tempData);
                var EFormDataContent = self.allFields;
                EFormDataContent.map(function(field, indexField){
                    var split = field.ref.split('_');
                    var section_ref = "section_"+split[1];
                    var row_ref = "row_"+split[1]+"_"+split[2];
                    var field_ref = field.ref;
                    if(field.moduleID > 0){
                        if(typeof self.refs[section_ref] !== 'undefined')
                            self.refs[section_ref].checkShowHide(field.value);
                    }
                    if(typeof self.refs[section_ref] !== 'undefined'){
                        if(typeof field.refChild === 'undefined'){
                            if(Config.getPrefixField(field.type, 'radio') > -1 || Config.getPrefixField(field.type, 'checkbox') > -1){
                                self.refs[section_ref].setValueForRadio(row_ref, field_ref, field.checked);
                            }else{
                                if(field.type === 'line_chart'){
                                    self.refs[section_ref].setValueForChart(row_ref, field_ref, field, 'line');
                                }
                                else if(field.type !== 'eform_input_image_doctor'){
                                    if(typeof self.refs[section_ref] !== 'undefined')
                                        self.refs[section_ref].setValue(row_ref, field_ref, field.value);
                                }
                            }
                        }else{
                            if(field.type === 'table'){
                                var fieldRefChild = field.refChild;
                                self.refs[section_ref].setValueForTable(row_ref, field_ref, field.refChild, field.value);
                            }
                        }
                    }
                })
                if(self.calculation.length > 0){
                    self.calculation.map(function(cal){
                        if(cal.type === 'SUMP'){
                            var total = 0;
                            cal.cal.map(function(name){
                                for(var i = 0; i < EFormDataContent.length; i++){
                                    if(EFormDataContent[i].name === name){
                                        total = parseInt(total)+parseInt(EFormDataContent[i].value);
                                    }
                                }
                            })
                            if(typeof self.refs[cal.section_ref] !== 'undefined')
                                self.refs[cal.section_ref].setValue(cal.row_ref, cal.field_ref, total);
                        }else if(cal.type === 'EQUALP'){
                            cal.cal.map(function(name){
                               for(var i = 0; i < EFormDataContent.length; i++){
                                    if(EFormDataContent[i].name === name && EFormDataContent[i].checked){
                                        if(cal.field.type  === 'eform_input_text'){
                                            if(typeof self.refs[cal.section_ref] !== 'undefined')
                                                self.refs[cal.section_ref].setValue(cal.row_ref, cal.field_ref, EFormDataContent[i].value);
                                        }
                                        if(EFormDataContent[i].value === cal.field.value){
                                            if(typeof self.refs[cal.section_ref] !== 'undefined')
                                                self.refs[cal.section_ref].setValueForRadio(cal.row_ref, cal.field_ref, EFormDataContent[i].checked);
                                        }else{
                                            if(cal.field.value === '1'){
                                                if(isNaN(EFormDataContent[i].value)){
                                                    if(typeof self.refs[cal.section_ref] !== 'undefined'){
                                                        self.refs[cal.section_ref].setValueForRadio(cal.row_ref, cal.field_ref, EFormDataContent[i].checked);
                                                    }
                                                }
                                            }
                                        }//end else
                                    }
                                } 
                            })
                        }
                    })
                }
            }else{
                var tempData = JSON.stringify(self.allFields);
                EFormService.formSaveInit({templateUID: self.templateUID, appointmentUID: self.appointmentUID, tempData: tempData, name: self.state.name, patientUID: self.patientUID, userUID: self.userUID})
                .then(function(response){
                    self.EFormID = response.data.ID;
                    self.EFormStatus = response.data.Status;
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
            var page_content = [];
            for(var i = 0; i < content.sections.length; i++){
                if(parseInt(self.page) === parseInt(content.sections[i].page)){
                    page_content.push(content.sections[i]);
                }
            }
            self.maxPage = content.sections[content.sections.length -1 ].page;
             EFormService.eformHistoryDetail({EFormTemplateUID: self.templateUID, PatientUID: self.patientUID})
            .then(function(result){
                self.setState(function(prevState){
                    return {
                        name: EFormTemplate.Name,
                        sections: Immutable.fromJS(page_content),
                        history: result.data.rows
                    }
                })

                $(self.refs['page_index_'+self.page]).addClass('active');
                if(self.page <= 1)
                    $(self.refs['page_index_previous']).addClass('disabled');
                else if (self.page >= self.maxPage)
                    $(self.refs['page_index_next']).addClass('disabled');
                self.allFields = content.objects;
		//tannv.dts@gmail.com comment
                // self._serverPreFormDetail(page_content);
                self._serverPreFormDetail(content.sections);
            })
        })
    },
    _mergeTwoObjects: function(obj_large, obj_small){
        var self = this;
        var temp_obj = $.extend([], obj_large);
        obj_small.map(function(item, index){
            for(var i = 0; i < obj_large.length; i++){
                if(typeof item.refChild === 'undefined'){
                    if(obj_large[i].ref === item.ref){
                        temp_obj[i] = item;
                        break;
                    }
                }else{
                    if(item.refChild === obj_large[i].refChild && obj_large[i].ref === item.ref){
                        temp_obj[i] = item;
                        break;  
                    }
                }
            }
        })
        return temp_obj;
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

            var appointmentUID = self.appointmentUID;
            var content = self._mergeTwoObjects(self.allFields, fields);
            content = JSON.stringify(content);

            if(self.EFormStatus === 'unsaved'){
                EFormService.formSave({id: self.EFormID, templateUID: self.templateUID, appointmentUID: appointmentUID, FormData: content, name: self.state.name, patientUID: self.patientUID, userUID: self.userUID})
                .then(function(){
                    resolve();
                    //window.location.reload();
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

        var appointmentUID = self.appointmentUID;
        var content = self._mergeTwoObjects(self.allFields, fields);

        var data = {
            printMethod: self.EFormTemplate.PrintType,
            data: content,
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
    _onGetPageContent: function (page) {
        if(page >= 1 && page <= this.maxPage)
        {
            var sections = this.state.sections.toJS();
            var fields = [];
            for(var i = 0; i < sections.length; i++){
                var section = sections[i];
                var sectionRef = section.ref;
                var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation('form');
                tempFields.map(function(field, index){
                    fields.push(field);
                })
            }

            var content = this._mergeTwoObjects(this.allFields, fields);
            content = JSON.stringify(content);
            EFormService.formSaveStep({id: this.EFormID, tempData: content})
            .then(function(response){
                var locationParams = Config.parseQueryString(window.location.href);
                locationParams.page = page;
                var queryString = $.param(locationParams);
                window.location.href = '/#/eform/detail?'+queryString;
                window.location.reload();
            })
        }
    },
    render: function(){
        var pageList = [];
        for (var i = 1; i <= this.maxPage; i++)
        {
            pageList.push(
                <li key = {i} ref={"page_index_"+i}>
                    <a onClick = {this._onGetPageContent.bind(this, i)}>{i}</a>
                </li>);

        }
        return (
            <div className="page-content">
                <ComponentPageBar ref="pageBar"
                        onSaveForm={this._onComponentPageBarSaveForm}
                        onPrintForm={this._onComponentPageBarPrintForm}/>
                <h3 className="page-title">{this.state.name}</h3>
                <div className="row">

                    {/*<div className="col-lg-3 col-md-12" style={{position: 'fixed', top: 40, right: 0}}>*/}
                    <div className="col-md-3 col-md-push-9">
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

                    {/*<div className="col-md-9">*/}
                    <div className="col-md-9 col-md-pull-3">
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
                                        name={section.get('name')}
                                         handleReloadDoctor = {this._handleReloadDoctor.bind(this, section)}
                                    />
                                else
                                    return null;
                            }, this)
                        }
                    </div>

                </div>
                <div className = "row">
                    <div className = "col-md-12">
                        <nav>
                            <ul className="pagination pagination-lg">
                                <li ref = "page_index_previous">
                                    <a aria-label="Previous" onClick = {this._onGetPageContent.bind(this, parseInt(this.page) - 1)}>
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                {pageList}
                                <li ref = "page_index_next">
                                    <a aria-label="Next" onClick = {this._onGetPageContent.bind(this, parseInt(this.page) + 1)}>
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>
        )
    }
})
