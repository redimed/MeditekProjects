var ComponentSection = require('modules/eform/eformTemplateDetail/section');
var EFormService = require('modules/eform/services');
var Config = require('config');
var ComponentPageBar = require('modules/eform/eformDetail/pageBar');
var History = ReactRouter.hashHistory;

module.exports = React.createClass({
    content: null,
    appointmentUID: null,
    patientUID: null,
    patient: null,
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
    field_age: [],
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
        var asyncArr = [];
        var EFormData = function (obj) {
            var preCalRes = obj.preCalRes;
            var refRow = obj.refRow;
            var refField = obj.refField;
            var refSection = obj.refSection;
            var promise = new Promise(function (resolve, reject) {
                setTimeout(function(refRow, refField, refSection){
                    EFormService.eformCheckDetail({templateName: preCalRes[1], appointmentCode: preCalRes[2]})
                        .then(function(eformRes){
                            if(eformRes.data) {
                                var formData = eformRes.data.EFormData.FormData?JSON.parse(eformRes.data.EFormData.FormData):null;
                                for (var i = 0; i < formData.length; i++) {
                                    var item = formData[i];
                                    if (item.name == preCalRes[0]) {
                                        objRef[refField] = {refRow: refRow, value: item.value};
                                        self.refs[refSection].setValue(refRow, refField, item.value);
                                        resolve({status: 'success', msg:'get value success'});
                                        break;
                                    }
                                }
                            } else {
                                resolve({status: 'warning', msg: 'not found'});
                            }
                        }, function (err) {
                            resolve({status:'error', msg: err});
                        })
                },0, refRow, refField, refSection);
            });
            return promise;
        }

        
        var CrossEFormData = function (obj) {
            var preCalRes = obj.preCalRes;
            var refRow = obj.refRow;
            var refField = obj.refField;
            var refSection = obj.refSection;
            var appointmentCode = preCalRes[preCalRes.length-1];

            var promiseList = [];
            for (var i = 0; i < preCalRes.length-1; i++) {
                var arr = preCalRes[i].split(':');//.replace(/ /g,'')
                var eformField = {
                    templateName: arr[0],
                    fieldName: arr[1]
                }
                var promise = new Promise(function(resolve, reject) {
                    setTimeout(function(eformField, refRow, refField, refSection){
                        EFormService.eformCheckDetail({templateName: eformField.templateName, appointmentCode: appointmentCode})
                            .then(function(eformRes){
                                if(eformRes.data) {
                                    var formData = eformRes.data.EFormData.FormData?JSON.parse(eformRes.data.EFormData.FormData):null;
                                    for (var i = 0; i < formData.length; i++) {
                                        var item = formData[i];
                                        if (item.name == eformField.fieldName) {
                                            objRef[refField] = {refRow: refRow, value: item.value};
                                            self.refs[refSection].setValue(refRow, refField, item.value);
                                            resolve({status: 'success', msg:'get value success'});
                                            break;
                                        }
                                    }
                                } else {
                                    resolve({status: 'warning', msg: 'not found'});
                                }
                            }, function (err) {
                                resolve({status:'error', msg: err});
                            })
                    }, 0, eformField, refRow, refField, refSection);
                });
                promiseList.push(promise);
            }
            return promiseList;
        }

        EFormService.getUserRoles({UID: this.userUID})
        .then(function(responseRoles){
            EFormService.preFormDetail({UID: self.appointmentUID, UserUID: self.userUID})
            .then(function(response){
                var appointmentInfo = response.data.Appointment;
                if(typeof response.data.Doctor !== 'undefined' && response.data.Doctor !== null){
                    self.signatureDoctor = response.data.Doctor.FileUpload;
                }
                else
                    self.signatureDoctor = '';
                EFormService.eformGetPatient({data: {UID: self.patientUID} })
                .then(function(responsePatient){
                    self.signaturePatient = responsePatient.data[0].Signature;
                    if(response.data.Patient) {
                        self.patient = response.data.Patient;
                    }
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
                                else if(field.type === 'eform_input_image_patient' && self.refs[section.ref]){
                                    self.refs[section.ref].setValue(row.ref, field.ref, self.signaturePatient);
                                }
                                var calArray = [];
                                if(typeof field.cal !== 'undefined')
                                    calArray = field.cal.split('|');
                                calArray.map(function(cal){
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
                                    /* BMI */
                                    if(Config.getPrefixField(cal, 'BMI(') > -1){
                                        if(cal !== ''){
                                            var calRes = Config.getArrayPrecal(4, cal);
                                            if(typeof self.refs[section.ref] !== 'undefined')
                                                self.refs[section.ref].bmi(row.ref, field.ref, calRes);
                                        }
                                    }
                                    /* END BMI */

                                    /* WHR BEGIN */
                                    if (Config.getPrefixField(cal, 'WHR(') > -1) {
                                        if (cal) {
                                            var calRes = Config.getArrayPrecal(4, cal);
                                            if (self.refs[section.ref]) {
                                                self.refs[section.ref].whr(row.ref, field.ref, calRes);
                                            }
                                        }
                                    }
                                    /* WHR END */

                                    /* MAXHR BEGIN */
                                    if (Config.getPrefixField(cal, 'MAXHR(') > -1) {
                                        if (cal) {
                                            var calRes = Config.getArrayPrecal(6, cal);
                                            if(self.refs[section.ref]) {
                                                self.refs[section.ref].maxHR(row.ref, field.ref, calRes);
                                            }
                                        }
                                    }
                                    /* MAXHR END */

                                    /* MAXHR BEGIN */
                                    if (Config.getPrefixField(cal, 'MAXHR85(') > -1) {
                                        if (cal) {
                                            var calRes = Config.getArrayPrecal(8, cal);
                                            if(self.refs[section.ref]) {
                                                self.refs[section.ref].maxHR85(row.ref, field.ref, calRes);
                                            }
                                        }
                                    }
                                    /* MAXHR END */

                                    /* AVG BEGIN */
                                    if (Config.getPrefixField(cal, 'AVG(') > -1) {
                                        if (cal) {
                                            var calRes = Config.getArrayPrecal(4, cal);
                                            if(self.refs[section.ref]) {
                                                self.refs[section.ref].avg(row.ref, field.ref, calRes);
                                            }
                                        }
                                    }
                                    /* AVG END */


                                    /*TRIGGERCHANGE BEGIN*/
                                    if (Config.getPrefixField(cal, 'TRIGGERCHANGE(') > -1) {
                                        if (cal) {
                                            var calRes = Config.getArrayPrecal(14, cal);
                                            if (self.refs[section.ref]) {
                                                self.refs[section.ref].triggerChange(row.ref, field.ref, calRes);
                                            }
                                        }
                                    }
                                    /*TRIGGERCHANGE END*/
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
                                            var checked = null;
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
                                                                checked = true;
                                                            }
                                                        }
                                                        else if(Config.getPrefixField(field.type,'radio') > -1){
                                                            if(field.value === responseTemp[key]){
                                                                value = 'yes';
                                                                checked = true;
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
                                            if (checked!==null) {
                                                objRef[field.ref].checked = checked;
                                            }
                                            if(self.refs[section.ref]) {
                                                self.refs[section.ref].setValue(row.ref, field.ref, value);
                                            }
                                        }
                                    }
                                    if(Config.getPrefixField(preCal,'AGE') > -1){
                                        if(preCal !== ''){
                                            var preCalRes = Config.getArrayPrecal(4, preCal);
                                            var preCalResItemArr = preCalRes[0].split('.');
                                            var responseTemp = null;
                                            var preCalResItemTemp = '';
                                            var res = '';
                                            if(preCalResItemArr.length > 1){
                                                responseTemp = response.data[preCalResItemArr[0]];
                                                preCalResItemTemp = preCalResItemArr[1];
                                            }else{
                                                responseTemp = response.data;
                                                preCalResItemTemp = preCalRes[0];
                                            }
                                            for(var key in responseTemp){
                                                if(key === preCalResItemTemp){
                                                    res = self._getAge(responseTemp[key]);
                                                    break;
                                                }
                                            }//end for

                                            objRef[field.ref] = {refRow: row.ref, value: value};
                                            if(self.refs[section.ref]) {
                                                self.refs[section.ref].setValue(row.ref, field.ref, res);
                                                self.field_age.push({name: field.name, res: res});
                                            }
                                        }
                                    }

                                    if (Config.getPrefixField(preCal, 'DEFAULTVALUE(') > -1) {
                                        var preCalRes = Config.getArrayPrecal(13, preCal);
                                        var value = null;
                                        if(preCalRes.length>0) {
                                            value = preCalRes[0];
                                        }
                                        if(self.refs[section.ref]) {
                                            if(Config.getPrefixField(field.type,'radio') > -1){
                                                value = field.value;
                                                objRef[field.ref] = {refRow: row.ref, value: value, checked: true};
                                                var item = $('#'+field.ref);
                                                item.iCheck('check');
                                            } else {
                                                objRef[field.ref] = {refRow: row.ref, value: value};
                                                self.refs[section.ref].setValue(row.ref, field.ref, value);
                                            }

                                        }
                                    }
                                    //EFORMDATA(FieldName, EFormName, 0/AppointmentCode) //0: appointment hien tai
                                    if (Config.getPrefixField(preCal, 'EFORMDATA(') > -1) {
                                        var preCalRes = Config.getArrayPrecal(10, preCal);
                                        if(preCalRes.length == 3 && self.refs[section.ref]) {
                                            if (preCalRes[2] == 0) {
                                                preCalRes[2] = appointmentInfo.Code;
                                            }
                                            var refRow = row.ref;
                                            var refField = field.ref;
                                            var refSection = section.ref;
                                            asyncArr.push(EFormData({preCalRes: preCalRes, refRow: refRow, refField: refField, refSection: refSection}));
                                        }
                                    }

                                    //EFORMDATA(EFormName:FieldName,EFormName:FieldName, 0/AppointmentCode) //0: appointment hien tai
                                    if (Config.getPrefixField(preCal, 'CROSSEFORMDATA(') > -1) {
                                        console.log("CROSSEFORMDATA", preCal);
                                        var preCalRes = Config.getArrayPrecal(15, preCal);
                                        if(self.refs[section.ref]) {
                                            if(preCalRes[preCalRes.length-1] == 0) {
                                                preCalRes[preCalRes.length-1] = appointmentInfo.Code;
                                            }
                                            var refRow = row.ref;
                                            var refField = field.ref;
                                            var refSection = section.ref;
                                            var listP = CrossEFormData({preCalRes: preCalRes, refRow: refRow, refField: refField, refSection: refSection});
                                            console.log("CROSSEFORMDATA: LISTP:", listP);
                                            listP.map(function(p) {
                                                asyncArr.push(p);
                                            })

                                        }
                                    }




                                    /* END CONCAT PREFIX */
                                    /* DEFAULT PREFIX */
                                    if(Config.getPrefixField(preCal,'DEFAULT(') > -1){
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

                    //self._checkServerEFormDetail();
                    Promise.all(asyncArr)
                    .then(function(values){
                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _serverPreFormDetail: asyncArr: exec: values: ", values);
                        for(var i =0; i <self.allFields.length; i++) {
                            if(objRef[self.allFields[i].ref]) {
                                self.allFields[i].value = objRef[self.allFields[i].ref].value;
                                if(objRef[self.allFields[i].ref].checked!==undefined) {
                                    self.allFields[i].checked = objRef[self.allFields[i].ref].checked;
                                }
                            }
                        }
                    })
                    self._checkServerEFormDetail();
                })// END EFormGetPatient
            })// END EFormGetUserRoles
        })
    },
    _getAge(birthday){
        var split_b = birthday.split('/');
        var real_birthday = split_b[2]+'-'+split_b[1]+'-'+split_b[0]+' 00:00:00';
        var real_birthday = moment(real_birthday).toDate();
        var today = new Date();
        var age = today.getFullYear() - real_birthday.getFullYear();
        var m = today.getMonth() - real_birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < real_birthday.getDate())) {
            age--;
        }
        return age;
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
                        if(typeof self.refs[section_ref] !== 'undefined'){
                            if(field.type === 'eform_input_check_radio'){
                                var radio_value = (field.checked)?'yes':'';
                               self.refs[section_ref].checkShowHide(radio_value); 
                            }
                            else{
                                self.refs[section_ref].checkShowHide(field.value);
                            }
                        }
                    }
                    if(typeof self.refs[section_ref] !== 'undefined'){
                        if(typeof field.refChild === 'undefined'){
                            if(Config.getPrefixField(field.type, 'radio') > -1 || Config.getPrefixField(field.type, 'checkbox') > -1){
                                if(Config.getPrefixField(field.name, 'bmi') === -1){
                                    self.refs[section_ref].setValueForRadio(row_ref, field_ref, field.checked);
                                }
                            }else{
                                if(field.type === 'line_chart'){
                                    self.refs[section_ref].setValueForChart(row_ref, field_ref, field, 'line');
                                }
                                else if(field.type !== 'eform_input_image_doctor'){
                                    if(typeof self.refs[section_ref] !== 'undefined'){
                                        
                                        self.refs[section_ref].setValue(row_ref, field_ref, field.value);
                                        self.field_age.map(function(f){
                                            if(f.name === field.name)
                                                self.refs[section_ref].setValue(row_ref, field_ref, f.res);
                                        })
                                    }
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
            self.content = content;
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
    _mergeTwoObjects: function(obj_large, obj_small, type){
        var self = this;
        var temp_obj = $.extend([], obj_large);
        for(var j = 0; j < obj_large.length; j++){
            if(type === 'print'){
                if(obj_large[j].type === 'eform_input_signature'){
                    if(temp_obj[j].value)
                        temp_obj[j].base64Data = temp_obj[j].value.sub;
                    temp_obj[j].value = null;
                }
                if(obj_large[j].value === 'TODAY')
                    temp_obj[j].value = moment().format('DD/MM/YYYY');
            }
        }
        obj_small.map(function(item, index){
            for(var i = 0; i < obj_large.length; i++){
                if(typeof item.refChild === 'undefined'){
                    if(obj_large[i].ref === item.ref){
                        if(type === 'print'){
                            if(obj_large[i] === 'eform_input_signature'){
                                if(temp_obj[j].value)
                                    temp_obj[i].base64Data = item.value.sub;
                                temp_obj[i].value = null;
                            }
                        }else
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
        var p = new Promise(function(resolve, reject){
            if(self.calculation.length > 0){
                self.calculation.map(function(cal){
                    if(cal.type === 'SUMP'){
                        var total = 0;
                        var field_index = 0;
                        cal.cal.map(function(name){
                            for(var i = 0; i < content.length; i++){
                                if(content[i].name === name){
                                    if(!isNaN(parseInt(content[i].value)))
                                        total = parseInt(total)+parseInt(content[i].value);
                                }
                                if(cal.field_ref === content[i].ref)
                                    field_index = i;
                            }
                        })
                        if(!isNaN(total))
                            content[field_index].value = total;
                    }else if(cal.type === 'EQUALP'){
                        var field_index = 0;
                        var value = '';
                        var checked = '';
                        cal.cal.map(function(name){
                           for(var i = 0; i < content.length; i++){
                                if(content[i].name === name && cal.field.type === 'eform_input_text'){
                                    if(content[i].type === 'eform_input_text')
                                        value = content[i].value;
                                    else
                                        if(content[i].checked === true)
                                            value = content[i].value;
                                }
                                if(content[i].name === name && content[i].checked === true){
                                    if(content[i].value === cal.field.value){
                                        checked = content[i].checked;
                                        value = content[i].value;
                                    }else{
                                        if(cal.field.value === '1'){
                                            if(isNaN(content[i].value)){
                                                checked = content[i].checked;
                                                value = content[i].value;
                                            }
                                        }
                                    }//end else
                                }
                                if(cal.field_ref === content[i].ref)
                                    field_index = i;
                            } 
                        })
                        content[field_index].value = value;
                        content[field_index].checked = checked;
                        if(value.length > 1){
                            if(value[0] === '0')
                                content[field_index].value = value.substring(1);
                        }
                        if(checked !== ''){
                            if(isNaN(value))
                                content[field_index].value = '1';
                        }
                    }
                })
            }

            content = JSON.stringify(content);

            if(self.EFormStatus === 'unsaved'){
                EFormService.formSave({id: self.EFormID, templateUID: self.templateUID, appointmentUID: appointmentUID, FormData: content, name: self.state.name, patientUID: self.patientUID, userUID: self.userUID})
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

        var fields = [];
        var chart_flag = false;

        this.content.sections.map(function(section){
            if(typeof section.viewType !== 'undefined'){
                if(section.viewType === 'dynamic'){
                    if(typeof self.refs[section.ref] !== 'undefined'){
                        var tempFields = self.refs[section.ref].getAllFieldValueWithValidation('print');
                        tempFields.map(function(field, index){
                            fields.push(field);
                        })
                    }else{
                        section.rows.map(function(row){
                            row.fields.map(function(content_field){
                                self.allFields.map(function(field){
                                    if(content_field.ref === field.ref){
                                        var temp_value = '';
                                        if(field.type === 'eform_input_check_radio'){
                                            if(field.checked === true)
                                                temp_value = 'yes';
                                            else if(field.checked === false)
                                                temp_value === 'no'
                                        }else
                                            temp_value = field.value;
                                        if(field.type === 'eform_input_check_checkbox'){
                                            if(field.checked === true)
                                                temp_value = 'yes';
                                            else if(field.checked === false)
                                                temp_value === 'no'
                                        }
                                        if(temp_value !== '' && temp_value !== null){
                                            fields.push(field); 
                                        }
                                    }
                                })
                            })
                        })
                    }
                }else{
                    self.allFields.map(function(field){
                        var f = $.extend({}, field);
                        if(field.type === 'eform_input_check_checkbox'){
                            f.value = (field.checked)?'yes':'no';
                        }
                        var split = field.ref.split('_');
                        var section_ref = "section_"+split[1];
                        if(field.type === 'eform_input_image_patient'){
                            if(typeof self.refs[section_ref] !== 'undefined')
                                var value = self.refs[section_ref].getValue(field.refRow, field.ref);
                            f.value = value;
                        }
                        if(section_ref === section.ref){
                            if(field.type === 'eform_input_signature'){
                                if(field.value)
                                    f.base64Data = field.value.sub;
                                f.value = null;
                            }
                            if(field.value === 'TODAY')
                                f.value = moment().format('DD/MM/YYYY');
                            if(field.type === 'table'){
                                if(field.typeChild === 'd'){
                                    if(field.value !== ''){
                                        var value = field.value.split(' ');
                                        value = value[0].split('-');
                                        f.value = value[2]+'/'+value[1]+'/'+value[0];
                                    }
                                }
                            }
                            fields.push(f);
                        }
                    })
                }
            }else{
                self.allFields.map(function(field){
                    var f = $.extend({}, field);
                    if(field.type === 'eform_input_check_checkbox'){
                        f.value = (field.checked)?'yes':'no';
                    }
                    var split = field.ref.split('_');
                    var section_ref = "section_"+split[1];
                    if(field.type === 'eform_input_image_patient'){
                        if(typeof self.refs[section_ref] !== 'undefined'){
                            var value = self.refs[section_ref].getValue(field.refRow, field.ref);
                            f.value = value;
                        }
                    }
                    if(section_ref === section.ref){
                        if(field.type === 'eform_input_signature'){
                            if(field.value)
                                f.base64Data = field.value.sub;
                            f.value = null;
                        }
                        if(field.value === 'TODAY')
                            f.value = moment().format('DD/MM/YYYY');
                        if(field.type === 'table'){
                            if(field.typeChild === 'd'){
                                if(field.value !== ''){
                                    var value = field.value.split(' ');
                                    value = value[0].split('-');
                                    f.value = value[2]+'/'+value[1]+'/'+value[0];
                                }
                            }
                            f.refChild = f.refChild.replace(f.name+'_', '');
                        }
                        if(field.type === 'line_chart'){
                            chart_flag = true;
                            var chart = $('#line_chart').highcharts();
                            var svg = chart.getSVG();
                            var image = new Image;
                            var canvas = document.createElement('canvas');
                            canvas.width = chart.chartWidth;
                            canvas.height = chart.chartHeight;
                            image.onload = function(){
                                canvas.getContext('2d').drawImage(this, 0, 0, chart.chartWidth, chart.chartHeight);
                                f.value = '';
                                f.base64Data = canvas.toDataURL().replace('data:image/png;base64,','');
                                fields.push(f);
                                html2canvas($('#line_chart_header'), {
                                    onrendered: function(canvas){
                                        var g = $.extend({}, f);
                                        g.name = f.name+'_1';
                                        g.base64Data = canvas.toDataURL().replace('data:image/png;base64,','');
                                        fields.push(g);
                                        var appointmentUID = self.appointmentUID;
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
                                            var filesaver = saveAs(blob, fileName);
                                            setTimeout(function(){
                                                window.location.reload();
                                            }, 1000)
                                        }, function(error){

                                        })
                                    }
                                })
                            }
                            image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
                            /*html2canvas($(self.refs.header), {
                                onrendered: function(canvas){
                                    self.image_header = canvas.toDataURL();
                                    self.image_header = self.image_header.replace('data:image/png;base64,','');
                                }
                            })*/
                        }
                        fields.push(f);
                    }
                })
            }
        })

        if(!chart_flag){
            var appointmentUID = self.appointmentUID;
            var data = {
                printMethod: self.EFormTemplate.PrintType,
                data: fields,
                templateUID: self.templateUID
            }

            //console.log(data);

            EFormService.createPDFForm(data)
            .then(function(response){
                var fileName = 'report_'+moment().format('X');
                var blob = new Blob([response], {
                    type: 'application/pdf'
                });
                var filesaver = saveAs(blob, fileName);
                setTimeout(function(){
                    window.location.reload();
                }, 1000)
            }, function(error){

            })
        }
    },
    _onGoToHistory: function(history){
        var appointmentUID = history.Appointments[0].UID;
        if(!window.noEFormAuth) {
            if(window.userAccess) {
                var ss= window.userAccess.authorization.substring(7);
                window.location.href = '/#/eform/detail?appointmentUID='+appointmentUID+'&patientUID='+this.patientUID+'&templateUID='+this.templateUID+'&userUID='+this.userUID+'&ss='+ss;
            } else {
                console.error("AUTHENTICATION:EFORM:useraccess not found");
            }
        } else {
            window.location.href = '/#/eform/detail?appointmentUID='+appointmentUID+'&patientUID='+this.patientUID+'&templateUID='+this.templateUID+'&userUID='+this.userUID;
        }
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
        var self = this;
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
            if(self.calculation.length > 0){
                self.calculation.map(function(cal){
                    if(cal.type === 'SUMP'){
                        var total = 0;
                        var field_index = 0;
                        cal.cal.map(function(name){
                            for(var i = 0; i < content.length; i++){
                                if(content[i].name === name){
                                    if(!isNaN(parseInt(content[i].value)))
                                        total = parseInt(total)+parseInt(content[i].value);
                                }
                                if(cal.field_ref === content[i].ref)
                                    field_index = i;
                            }
                        })
                        if(!isNaN(total))
                            content[field_index].value = total;
                    }else if(cal.type === 'EQUALP'){
                        var field_index = 0;
                        var value = '';
                        var checked = '';
                        cal.cal.map(function(name){
                           for(var i = 0; i < content.length; i++){
                                if(content[i].name === name && cal.field.type === 'eform_input_text'){
                                    if(content[i].type === 'eform_input_text')
                                        value = content[i].value;
                                    else
                                        if(content[i].checked === true)
                                            value = content[i].value;
                                }
                                if(content[i].name === name && content[i].checked === true){
                                    if(content[i].value === cal.field.value){
                                        checked = content[i].checked;
                                        value = content[i].value;
                                    }else{
                                        if(cal.field.value === '1'){
                                            if(isNaN(content[i].value)){
                                                checked = content[i].checked;
                                                value = content[i].value;
                                            }
                                        }
                                    }//end else
                                }
                                if(cal.field_ref === content[i].ref)
                                    field_index = i;
                            } 
                        })
                        content[field_index].value = value;
                        content[field_index].checked = checked;
                        if(value.length > 1){
                            if(value[0] === '0')
                                content[field_index].value = value.substring(1);
                        }
                        if(checked !== ''){
                            if(isNaN(value))
                                content[field_index].value = '1';
                        }
                    }
                })
            }

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
                <div className = "">
                    <div className = " eform-col-center">
                        <nav>
                            <ul className="pagination pagination-lg">
                                <li ref = "page_index_previous">
                                    <a aria-label="Previous" onClick = {this._onGetPageContent.bind(this, parseInt(this.page) - 1)}>
                                        <span aria-hidden="true">Previous Page</span>
                                    </a>
                                </li>
                                {pageList}
                                <li ref = "page_index_next">
                                    <a aria-label="Next" onClick = {this._onGetPageContent.bind(this, parseInt(this.page) + 1)}>
                                        <span aria-hidden="true">Next Page</span>
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
