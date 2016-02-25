var ComponentPageBar = require('modules/eform/mainClientDetail/pageBar');
var ComponentSection = require('modules/eform/mainDetail/section');
var EFormService = require('modules/eform/services');
var history = ReactRouter.hashHistory;
var Config = require('config');

module.exports = React.createClass({
            templateId: null,
	getInitialState: function(){
		return {
            name: '',
			sections: Immutable.List()
		}
	},
	_loadPreview: function(){
        var self = this;
        var formDetailClient = new Promise(function(resolve, reject){
            EFormService.formClientDetail({id: self.props.params.clientId})
            .then(function(response){
                var formDetailClientData = response.data;
                resolve(formDetailClientData);
            })
        })
        var formDetail = new Promise(function(resolve, reject){
            formDetailClient.then(function(formDetailClientData){
                EFormService.formDetail({id: formDetailClientData.EFormTemplateID})
                .then(function(response){
                    var EFormTemplate = response.data;
                    self.templateId = EFormTemplate.ID;
                    var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
                    self.setState(function(prevState){
                        return {
                            name: EFormTemplate.Name,
                            sections: Immutable.fromJS(content)
                        }
                    })
                    resolve(formDetailClientData);
                })
            })
        })
        formDetail.then(function(preResponse){
            self._serverPreFromDetail(preResponse);
        })
    },
    _serverPreFromDetail: function(preData){
        var self = this;
        EFormService.preFormDetail({UID: this.props.params.appointmentId})
        .then(function(response){
            var data = response.data;
            var sections = self.state.sections.toJS();
            for(var i = 0; i < sections.length; i++){
                var section = sections[i];
                var fields = section.fields;
                var sectionRef = "section"+i;
                fields.map(function(field, indexField){
                    var type = field.code;
                    if(type !== 'table' && type !== 'label' && type !== 'labelh'){
                        var name = field.name;
                        var fieldRef = field.ref;
                        for(var keyData in data){
                            if(keyData === name){
                                if(type === 'rlh'){
                                    if(field.value === data[keyData])
                                        self.refs[sectionRef].setValueForRadio(fieldRef);
                                }else
                                    self.refs[sectionRef].setValue(fieldRef, data[keyData]);
                                break;
                            }
                        }
                    }
                })
            }
            var contentClient = JSON.parse(preData.EFormData.FormData);
            contentClient.map(function(field, indexField){
                var fieldRef = field.ref;
                var fieldData = field.value;
                var fieldType = field.type;
                for(var i = 0; i < sections.length; i++){
                    var section = sections[i];
                    var fields = section.fields;
                    var sectionRef = "section"+i;
                    if(typeof field.refChild === 'undefined'){
                        if(fieldType === 'rlh'){
                            if(field.checked)
                                self.refs[sectionRef].setValueForRadio(fieldRef);
                        }else{
                            self.refs[sectionRef].setValue(fieldRef, fieldData);
                        }
                    }else{
                        var fieldRefChild = field.refChild;
                        self.refs[sectionRef].setValueForTable(fieldRef, fieldRefChild, fieldData);
                    }
                }
            })
        })
    },
    _onComponentPageBarPrintForm: function(){
        var fields = [];
        var sections = this.state.sections.toJS();
        for(var i = 0; i < sections.length; i++){
            var section = sections[i];
            var sectionRef = "section"+i;
            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }

        var data = {
            printMethod : "itext",
            templateUID: this.templateId,
            data: fields
        }

        EFormService.createPDFForm(data)
        .then(function(response){
                var blob = new Blob([response],{
                        type: 'application/pdf'
                    });
                    swal("Success!", "Your form has been download to PDF.", "success");
                    saveAs(blob,'pdfForm');
                
        }, function(error){
                if(error.status === 200){
                    var blob = new Blob([error.responseText],{
                        type: 'application/pdf'
                    });
                    swal("Success!", "Your form has been download to PDF.", "success");
                    saveAs(blob,'pdfForm');
                }
        })
    },
    componentDidMount: function(){
        this._loadPreview();
        this.refs.pageBar.init(this.props.params);
    },
	_onComponentPageBarSaveForm: function(){
		var formId = this.props.params.formId;
        var sections = this.state.sections.toJS();
        var self = this;
        var fields = [];
        for(var i = 0; i < sections.length; i++){
            var section = sections[i];
            var sectionRef = "section"+i;
            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }
        var content = JSON.stringify(fields);
        var appointmentId = this.props.params.appointmentId;
        EFormService.formClientUpdate({id: this.props.params.clientId, content: content})
        .then(function(){
            swal("Success!", "Your form has been saved.", "success");
            history.push(Config.getParamsIframe(appointmentId, self.props.params.patientId));
        })
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
                			ref={"section"+index}
                			key={index}
                			code={index}
                            type="client"
                			fields={section.get('fields')}
                			name={section.get('name')}/>
                	}, this)
                }
			</div>
		)
	}
})