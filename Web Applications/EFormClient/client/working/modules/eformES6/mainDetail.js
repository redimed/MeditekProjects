import Pagebar from 'modules/eform/mainDetail/pagebar'
import Section from 'modules/eform/mainDetail/section'
import FormService from 'modules/eform/services'

class MainDetail extends React.Component{
    constructor(){
        super()
        this.state = {
            sections: Immutable.List()
        }
        this.formDetail = []
    }
    _loadPreview(){
        FormService.formDetail({id: this.props.params.formId})
        .then(function(response){
            var content = JSON.parse(response.data[0].content);
            this.setState(({sections})=>{
                return {
                    sections: Immutable.fromJS(content)
                }
            })    
        }.bind(this))
    }
    componentDidMount(){
        this._loadPreview()
    }
	_onAddNewSection(){
        this.setState(({sections})=>{
            return {
                sections: sections.push(Immutable.Map({name: 'New Section', fields: Immutable.List()}))
            }
        })
		swal("Success!", "Your section has been created.", "success");
	}
    _onSaveForm(){
        const formId = this.props.params.formId
        const content = this.state.sections.toJS()
        FormService.formSave({id: formId, content: JSON.stringify(content)})
        .then(function(response){
            swal("Success!", "Your form has been saved.", "success");
        }.bind(this))
    }
    _onDeleteSection(code){
        this.setState(({sections})=>{
            return {
                sections: sections.delete(code)
            }
        })
        swal("Deleted!", "Your section has been deleted.", "success")
    }
    _onUpdateSection(code, name){
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([code,'name'], val => name)
            }
        })
        swal("Updated!", "Your section "+name+" has been updated.", "success")
    }
    _onAddTableColumn(codeSection, codeField){
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([codeSection,'fields',codeField,'content','cols'], val => val.push(
                    Immutable.Map(
                        {label: 'Label Table', type: 'it'}
                    )
                ))
            }
        })
        swal("Success!", "Add column table successfully.", "success")
    }
    _onAddTableRow(codeSection, codeField){
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([codeSection,'fields',codeField,'content','rows'], val => val+1)
            }
        })
        swal("Success!", "Add row table successfully.", "success")
    }
    _onDeleteTableRow(codeSection, codeField){
        const row = this.state.sections.get(codeSection).get('fields').get(codeField).get('content').get('rows')
        if(row > 1){
            this.setState(({sections})=>{
                return {
                    sections: sections.updateIn([codeSection,'fields',codeField,'content','rows'], val => val-1)
                }
            })
            swal("Success!", "Delete row table successfully.", "success")
        }else
            swal("Warning!", "Must contain 1 row.", "warning")
    }
    _onDeleteTableColumn(codeSection, codeField, codeColumn){
        const columns = this.state.sections.get(codeSection).get('fields').get(codeField).get('content').get('cols')
        if(columns.size > 1){
            this.setState(({sections})=>{
                return {
                    sections: sections.deleteIn([codeSection,'fields',codeField,'content','cols',codeColumn])
                }
            })
            swal("Success!", "Delete column table successfully.", "success")
        }else
            swal("Warning!", "Must contain 1 column.", "warning")
    }
    _onUpdateTableColumn(codeSection, codeField, data){
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([codeSection,'fields',codeField,'content','cols',data.code], val => 
                    val.set('label', data.label)
                        .set('type', data.type)
                )
            }
        })
        swal("Success!", "Update column table successfully.", "success")
    }
    _onSelectField(codeSection, codeField){
        if(codeField === 'label'){
            this.setState(({sections})=>{
                return {
                    sections: sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.Map(
                            {code: codeField, label: 'Separate Label', size: '12'}
                        )
                    ))
                }
            })
        }else if(codeField === 'table'){
            this.setState(({sections})=>{
                return {
                    sections: sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.fromJS({
                            code: codeField,
                            content: {
                                cols: [{label: 'Label Table', type: 'it'}],
                                rows: 1
                            }
                        })
                    ))
                }
            })
        }else{
            this.setState(({sections})=>{
                return {
                    sections: sections.updateIn([codeSection,'fields'], val => val.push(
                        Immutable.Map(
                            {code: codeField, name: '', id: '', label: 'Label', size: '12', relationships: Immutable.List()}
                        )
                    ))
                }
            })
        }
        swal("Success!", "Add field successfully.", "success")
    }
    _onDeleteField(codeSection, codeField){
        this.setState(({sections})=>{
            return {
                sections: sections.deleteIn([codeSection,'fields',codeField])
            }
        })
        swal("Deleted!", "Delete field successfully.", "success")
    }
    _onSaveFieldDetail(codeSection, dataField){
        if(dataField.type === 'label')
            this.setState(({sections})=>{
                return {
                    sections: sections.updateIn([codeSection,'fields',dataField.code], val => 
                            val.set('label',dataField.label)
                            .set('size',dataField.size)
                    )
                }
            })
        else
            this.setState(({sections})=>{
                return {
                    sections: sections.updateIn([codeSection,'fields',dataField.code], val => 
                            val.set('name',dataField.name)
                            .set('label',dataField.label)
                            .set('size',dataField.size)
                            .set('id',dataField.name)
                    )
                }
            })
        swal("Success!", "Edit field successfully.", "success")
    }
    _onDragField(fromObj, toObj){
        const fromImmutable = this.state.sections.get(fromObj.codeSection).get('fields').get(fromObj.codeField)
        const toImmutable = this.state.sections.get(toObj.codeSection).get('fields').get(toObj.codeField)
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([fromObj.codeSection,'fields',fromObj.codeField], val => toImmutable)
            }
        })
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([toObj.codeSection,'fields',toObj.codeField], val => fromImmutable)
            }
        })
        swal("Success!", "Drag change field successfully.", "success")
    }
    _onDragSection(fromObj, toObj){
        const fromImmutable = this.state.sections.get(fromObj.codeSection)
        const toImmutable = this.state.sections.get(toObj.codeSection)
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([fromObj.codeSection], val => toImmutable)
            }
        })
        this.setState(({sections})=>{
            return {
                sections: sections.updateIn([toObj.codeSection], val => fromImmutable)
            }
        })
        swal("Success!", "Drag change section successfully.", "success")   
    }
	render(){
        const {sections} = this.state
		return (
			<div className="page-content">
				<Pagebar onAddNewSection={this._onAddNewSection.bind(this)}
                    onSaveForm={this._onSaveForm.bind(this)}/>
				<h3 className="page-title"> E-Form
                    <small> use for paperless</small>
                </h3>
                {
                    sections.map((section, index)=>{
                        return (
                            <Section 
                                key={index}
                                code={index}
                                name={section.get('name')}
                                fields={section.get('fields')}
                                onDeleteSection={this._onDeleteSection.bind(this)}
                                onUpdateSection={this._onUpdateSection.bind(this)}
                                onSelectField={this._onSelectField.bind(this)}
                                onSaveFieldDetail={this._onSaveFieldDetail.bind(this)}
                                onDeleteField={this._onDeleteField.bind(this)}
                                onAddTableColumn={this._onAddTableColumn.bind(this)}
                                onAddTableRow={this._onAddTableRow.bind(this)}
                                onDeleteTableRow={this._onDeleteTableRow.bind(this)}
                                onDeleteTableColumn={this._onDeleteTableColumn.bind(this)}
                                onUpdateTableColumn={this._onUpdateTableColumn.bind(this)}
                                onDragField={this._onDragField.bind(this)}
                                onDragSection={this._onDragSection.bind(this)}/>
                        )
                    })
                }
			</div>
		)
	}
}

export default MainDetail