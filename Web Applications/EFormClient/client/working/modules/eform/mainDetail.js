var ComponentPageBar = require('modules/eform/mainDetail/pageBar');
var ComponentSection = require('modules/eform/mainDetail/section');
var EFormService = require('modules/eform/services');

module.exports = React.createClass({
	getInitialState: function(){
		return {
            name: 'New EForm',
            sections: Immutable.List()
        }
	},
	_loadPreview: function(){
        EFormService.formDetail({id: this.props.params.formId})
        .then(function(response){
            var EFormTemplate = response.data;
            var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
            this.setState(function(prevState){
                return {
                    name: EFormTemplate.Name,
                    sections: Immutable.fromJS(content)
                }
            })    
        }.bind(this))
    },
    componentDidMount: function(){
        this._loadPreview();
    },
	_onComponentPageBarAddNewSection: function(){
		this.setState(function(prevState){
            return {
                sections: prevState.sections.push(Immutable.Map({name: 'New Section', fields: Immutable.List()}))
            }
        })
		swal("Success!", "Your section has been created.", "success");
	},
	_onComponentSectionUpdate: function(code, name){
		this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([code,'name'], val=>name)
            }
        })
        swal("Updated!", "Your section "+name+" has been updated.", "success")
	},
	_onComponentSectionRemove: function(code){
		this.setState(function(prevState){
            return {
                sections: prevState.sections.delete(code)
            }
        })
        swal("Deleted!", "Your section has been deleted.", "success")
	},
	_onComponentSectionDrag: function(fromObj, toObj){
		var fromImmutable = this.state.sections.get(fromObj.codeSection);
        var toImmutable = this.state.sections.get(toObj.codeSection);
        this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([fromObj.codeSection], val => toImmutable)
            }
        })
        this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([toObj.codeSection], val => fromImmutable)
            }
        })
        swal("Success!", "Drag change section successfully.", "success");
	},
	_onComponentSectionSelectField: function(codeSection, codeField){
        var fields = this.state.sections.get(codeSection).get('fields');
        var ref = "field_"+codeSection+'_'+fields.size;
		if(codeField === 'label' || codeField === 'labelh'){
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.Map(
                            {code: codeField, label: 'Separate Label', size: '12', ref: ref}
                        )
                    ))
                }
            })
        }else if(codeField === 'table'){
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.fromJS({
                            code: codeField,
                            ref: ref,
                            content: {
                                cols: [{label: 'Label Table', type: 'it'}],
                                rows: 1
                            }
                        })
                    ))
                }
            })
        }else if(codeField === 'break'){
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.Map(
                            {code: codeField, label: 'Separate Label', size: '12', ref: ref}
                        )
                    ))
                }
            })
        }else{
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.Map(
                            {code: codeField, name: '', label: 'Label', size: '12', ref: ref, relationships: Immutable.List()}
                        )
                    ))
                }
            })
        }
        swal("Success!", "Add field successfully.", "success")
	},
	_onComponentSectionDragField: function(fromObj, toObj){
		var fromImmutable = this.state.sections.get(fromObj.codeSection).get('fields').get(fromObj.codeField);
        var toImmutable = this.state.sections.get(toObj.codeSection).get('fields').get(toObj.codeField);

        this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([fromObj.codeSection,'fields',fromObj.codeField], val => toImmutable)
            }
        })
        this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([toObj.codeSection,'fields',toObj.codeField], val => fromImmutable)
            }
        })
        swal("Success!", "Drag change field successfully.", "success");
	},
	_onComponentSectionRemoveField: function(codeSection, codeField){
		this.setState(function(prevState){
            return {
                sections: prevState.sections.deleteIn([codeSection,'fields',codeField])
            }
        })
        swal("Deleted!", "Delete field successfully.", "success");
	},
	_onComponentSectionSaveFieldDetail: function(codeSection, dataField){
		if(dataField.type === 'label' && dataField.type === 'labelh')
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'fields',dataField.code], val => 
                            val.set('label',dataField.label)
                            .set('size',dataField.size)
                    )
                }
            })
        else{
            if(dataField.type === 'rlh'){
                this.setState(function(prevState){
                    return {
                        sections: prevState.sections.updateIn([codeSection,'fields',dataField.code], val => 
                                val.set('name',dataField.name)
                                .set('label',dataField.label)
                                .set('size',dataField.size)
                                .set('value',dataField.value)
                        )
                    }
                })
            }else{
                this.setState(function(prevState){
                    return {
                        sections: prevState.sections.updateIn([codeSection,'fields',dataField.code], val => 
                                val.set('name',dataField.name)
                                .set('label',dataField.label)
                                .set('size',dataField.size)
                        )
                    }
                })
            }
        }
        swal("Success!", "Edit field successfully.", "success");
	},
	_onComponentSectionCreateTableRow: function(codeSection, codeField){
		this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','rows'], val => val+1)
            }
        })
        swal("Success!", "Add row table successfully.", "success")
	},
	_onComponentSectionCreateTableColumn: function(codeSection, codeField){
		this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','cols'], val => val.push(
                    Immutable.Map(
                        {label: 'Label Table', type: 'it'}
                    )
                ))
            }
        })
        swal("Success!", "Add column table successfully.", "success");
	},
	_onComponentSectionRemoveTableRow: function(codeSection, codeField){
		var row = this.state.sections.get(codeSection).get('fields').get(codeField).get('content').get('rows');
        if(row > 1){
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','rows'], val => val-1)
                }
            })
            swal("Success!", "Delete row table successfully.", "success")
        }else
            swal("Warning!", "Must contain 1 row.", "warning")
	},
	_onComponentSectionRemoveTableColumn: function(codeSection, codeField, codeColumn){
		var columns = this.state.sections.get(codeSection).get('fields').get(codeField).get('content').get('cols')
        if(columns.size > 1){
            this.setState(function(prevState){
                return {
                    sections: prevState.sections.deleteIn([codeSection,'fields',codeField,'content','cols',codeColumn])
                }
            })
            swal("Success!", "Delete column table successfully.", "success")
        }else
            swal("Warning!", "Must contain 1 column.", "warning")
	},
	_onComponentSectionUpdateTableColumn: function(codeSection, codeField, data){
		 this.setState(function(prevState){
            return {
                sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','cols',data.code], val => 
                    val.set('label', data.label)
                        .set('type', data.type)
                )
            }
        })
        swal("Success!", "Update column table successfully.", "success")
	},
	_onComponentPageBarSaveForm: function(){
		var formId = this.props.params.formId;
        var content = this.state.sections.toJS();
        EFormService.formSave({id: formId, content: JSON.stringify(content)})
        .then(function(response){
            swal("Success!", "Your form has been saved.", "success");
        }.bind(this))
	},
	render: function(){
		return (
			<div className="page-content">
				<ComponentPageBar ref="pageBar"
					onAddNewSection={this._onComponentPageBarAddNewSection}
					onSaveForm={this._onComponentPageBarSaveForm}/>
				<h3 className="page-title">{this.state.name}</h3>
                {
                	this.state.sections.map(function(section, index){
                		return <ComponentSection key={index}
                			ref="section"
                			key={index}
                			code={index}
                			fields={section.get('fields')}
                			name={section.get('name')}
                			onUpdateSection={this._onComponentSectionUpdate}
                			onRemoveSection={this._onComponentSectionRemove}
                			onDragSection={this._onComponentSectionDrag}
                			onSelectField={this._onComponentSectionSelectField}
                			onDragField={this._onComponentSectionDragField}
                			onRemoveField={this._onComponentSectionRemoveField}
                			onSaveFieldDetail={this._onComponentSectionSaveFieldDetail}
                			onCreateTableRow={this._onComponentSectionCreateTableRow}
                			onRemoveTableRow={this._onComponentSectionRemoveTableRow}
                			onCreateTableColumn={this._onComponentSectionCreateTableColumn}
                			onRemoveTableColumn={this._onComponentSectionRemoveTableColumn}
                			onUpdateTableColumn={this._onComponentSectionUpdateTableColumn}/>
                	}, this)
                }
			</div>
		)
	}
})