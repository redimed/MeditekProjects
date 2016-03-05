var ComponentSection = require('modules/eform/eformTemplateDetail/section');
var EFormService = require('modules/eform/services');
var Config = require('config');
var ComponentPageBar = require('modules/eform/eformDetail/pageBar');

module.exports = React.createClass({
    appointmentUID: null,
    patientUID: null,
    userUID: null,
    templateUID: null,
    formUID: null,
    getInitialState: function(){
        return {
            name: '',
            sections: Immutable.List()
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
        EFormService.preFormDetail({UID: this.appointmentUID})
        .then(function(response){
            for(var section_index = 0; section_index < content.length; section_index++){
                var section = content[section_index];
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
                                    var preCalRes = Config.getArrayConcat(preCal);
                                    var value = '';
                                    preCalRes.map(function(preCalResItem){
                                        for(var key in response.data){
                                            if(key === preCalResItem){
                                                value += response.data[key]+' ';
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
                        })
                    }
                }
            }
        })
    },
    _checkServerEFormDetail: function(){
        var self = this;
        EFormService.eformCheckDetail({templateUID: this.templateUID})
        .then(function(response){
            if(response.data){
                self.formUID = response.data.UID;
                var EFormDataContent = JSON.parse(response.data.EFormData.FormData);
                EFormDataContent.map(function(field, indexField){
                    console.log(field);
                    var fieldRef = field.ref;
                    var fieldData = field.value;
                    var rowRef = field.refRow;
                    var sections = self.state.sections.toJS();
                    for(var i = 0; i < sections.length; i++){
                        var section = sections[i];
                        if(typeof field.refChild === 'undefined'){
                            if(Config.getPrefixField(field.type, 'radio') > -1){
                                if(field.checked)
                                    self.refs[section.ref].setValueForRadio(rowRef, fieldRef);
                            }else{
                                self.refs[section.ref].setValue(rowRef, fieldRef, fieldData);
                            }
                        }else{
                            var fieldRefChild = field.refChild;
                            self.refs[section.ref].setValueForTable(rowRef, fieldRef, fieldRefChild, fieldData);
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
            var EFormTemplate = response.data;
            var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
            self._serverPreFormDetail(content);
            self.setState(function(prevState){
                return {
                    name: EFormTemplate.Name,
                    sections: Immutable.fromJS(content)
                }
            })
            self._checkServerEFormDetail();
        })
    },
    _onComponentPageBarSaveForm: function(){
        var templateUID = this.templateUID;
        var sections = this.state.sections.toJS();
        var self = this;
        var fields = [];
        for(var i = 0; i < sections.length; i++){
            var section = sections[i];
            var sectionRef = section.ref;
            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }
        var content = JSON.stringify(fields);
        var appointmentUID = this.appointmentUID;
        console.log(this.formUID);
        if(this.formUID === null){
            EFormService.formSave({templateUID: this.templateUID, content: content, name: this.state.name, patientUID: this.patientUID, userUID: this.userUID})
            .then(function(){
                swal("Success!", "Your form has been saved.", "success");
            })
        }else{
            EFormService.formUpdate({UID: this.formUID, content: content})
            .then(function(){
                swal("Success!", "Your form has been saved.", "success");
            })  
        }
    },
    render: function(){
        return (
            <div className="page-content">
                <ComponentPageBar ref="pageBar"
                        onSaveForm={this._onComponentPageBarSaveForm}
                        onPrintForm={this._onComponentPageBarPrintForm}/>
                <h3 className="page-title">{this.state.name}</h3>
                {
                        this.state.sections.map(function(section, index){
                            return <ComponentSection key={index}
                                ref={section.get('ref')}
                                refTemp={section.get('ref')}
                                key={index}
                                code={index}
                                type="section"
                                permission="normal"
                                rows={section.get('rows')}
                                name={section.get('name')}/>
                        }, this)
                }
                <ComponentPageBar ref="pageBarBottom"
                        onSaveForm={this._onComponentPageBarSaveForm}
                        onPrintForm={this._onComponentPageBarPrintForm}/>
            </div>
        )
    }
})