import Modal from 'common/modal'
import UpdateSection from 'modules/eform/mainDetail/formUpdateSection'
import ListField from 'modules/eform/mainDetail/listField'
import FieldDetail from 'modules/eform/mainDetail/fieldDetail'
import InputText from 'common/inputText'
import InputDate from 'common/inputDate'
import TextArea from 'common/textarea'
import Checkbox from 'common/checkbox'
import Label from 'common/label'
import Table from 'modules/eform/mainDetail/tableField'

class Section extends React.Component{
    constructor(){
        super()
        this.drake = null
        this.sectionDrake = null
    }
    componentDidMount(){
        this._dragAndDropElements()
    }
    componentDidUpdate(prevProps,prevState){
        this.drake.destroy()
        this.sectionDrake.destroy()
        this._dragAndDropElements()
    }
    _dragAndDropElements(){
        this.drake = dragula([].slice.apply(document.querySelectorAll('.dragula')),{
            copy: true,
            revertOnSpill: true
        });
        this.sectionDrake = dragula([].slice.apply(document.querySelectorAll('.dragulaSection')),{
            copy: true,
            revertOnSpill: true,
            moves: function(el, container, handle){
                return handle.className.indexOf('dragulaSectionHandler') > -1;
            }
        });
        var self = this
        this.drake.on('drop', function(el,target,source,sibling){
            swal({
                title: 'Are you sure?',
                text: 'You will change this field',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm){
                if(isConfirm){
                    var fromEl = el.id
                    const targetArray = $(target).find('.form-group')
                    $.each(targetArray, function(index, value){
                        var tempId = $(value).attr('id')
                        if(tempId !== fromEl){
                            const fromArr = fromEl.split('_')
                            const toArr = tempId.split('_')
                            const fromObj = {codeSection: fromArr[1], codeField: fromArr[2]}
                            const toObj = {codeSection: toArr[1], codeField: toArr[2]}
                            self.props.onDragField(fromObj, toObj)
                        }
                    })
                }else{
                    swal("No change", "Form will refresh.", "success")
                    if (el.parentNode == target) {
                        target.removeChild(el)
                    }
                }
            })
        })
        this.sectionDrake.on('drop', function(el,target,source,sibling){
            swal({
                title: 'Are you sure?',
                text: 'You will change this section',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm){
                if(isConfirm){
                    var fromEl = el.id
                    const targetArray = $(target).find('.portlet')
                    $.each(targetArray, function(index, value){
                        var tempId = $(value).attr('id')
                        if(tempId !== fromEl){
                            const fromArr = fromEl.split('_')
                            const toArr = tempId.split('_')
                            const fromObj = {codeSection: fromArr[1]}
                            const toObj = {codeSection: toArr[1]}
                            self.props.onDragSection(fromObj, toObj)
                        }
                    })
                }else{
                    swal("No change", "Form will refresh.", "success")
                    if (el.parentNode == target) {
                        target.removeChild(el)
                    }
                }
            })
        })
    }
    _onEditSection(){
        this.refs.modalUpdateSection.show()
    }
    _onAddFieldSection(){
        this.refs.modalAddFieldSection.show()
    }
    _onSelectField(item){
        this.refs.modalAddFieldSection.hide()
        this.props.onSelectField(this.props.code,item.get('code'))
    }
    _onSaveFieldDetail(data){
        swal({
            title: 'Are you sure?',
            text: 'You will edit this field',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            this.props.onSaveFieldDetail(this.props.code,data);
            this.refs.modalFieldDetail.hide()
        }.bind(this))
    }
    _onSaveUpdateSection(){
        const name = this.refs.formUpdateSection.getName()
        swal({
            title: 'Are you sure?',
            text: 'You will edit section '+this.props.name,
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            this.refs.modalUpdateSection.hide()
            this.props.onUpdateSection(this.props.code,name)
        }.bind(this))
    }
    _onDeleteSection(){
        swal({
            title: 'Are you sure?',
            text: 'You will delete section '+this.props.name,
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            this.props.onDeleteSection(this.props.code);
        }.bind(this))
    }
    _onRightClickTableItem(code, e){
        let id = $(e.target).attr('id')
        if(typeof id === 'undefined')
            id = $(e.target).parent().attr('id')
        const ref = "field"+code
        switch(id){
            case 'deleteTable':
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function(){
                    this.props.onDeleteField(this.props.code, code);
                }.bind(this))
                break;
            case 'addRow':
                swal({
                    title: 'Are you sure?',
                    text: 'You will add a row into this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function(){
                    this.props.onAddTableRow(this.props.code, code);
                }.bind(this))
                break;
            case 'deleteRow':
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete a row in this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function(){
                    this.props.onDeleteTableRow(this.props.code, code);
                }.bind(this))
                break;
            case 'addCol':
                swal({
                    title: 'Are you sure?',
                    text: 'You will add a column into this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function(){
                    this.props.onAddTableColumn(this.props.code, code);
                }.bind(this))
                break;
        }
    }
    _onRightClickItem(code, e){
        let id = $(e.target).attr('id')
        if(typeof id === 'undefined')
            id = $(e.target).parent().attr('id')
        const ref = "field"+code
        const type = this.refs[ref].getType()
        const label = this.refs[ref].getLabel()
        const size = this.refs[ref].getSize()
        let dataFieldDetail = null
        if(type !== 'label'){
            const name = this.refs[ref].getName()
            dataFieldDetail = {
                name: name, label: label, size: size, code: code, type: type
            }
        }else{
            dataFieldDetail = {
                label: label, size: size, code: code, type: type
            }
        }
        switch(id){
            case 'editField':
                this.refs.modalFieldDetail.show()
                this.refs.fieldDetail.init(dataFieldDetail)
                break;
            case 'deleteField':
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete this field ?',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function(){
                    this.props.onDeleteField(this.props.code, code);
                }.bind(this))
                break;
        }
    }
    _onDeleteColumn(codeField, codeColumn){
        this.props.onDeleteTableColumn(this.props.code, codeField, codeColumn)
    }
    _onUpdateColumn(codeField, data){
        this.props.onUpdateTableColumn(this.props.code, codeField, data)
    }
	render(){
		return (
			<div className="row">
                <div id="contextTableMenu">
                    <ul className="dropdown-menu" role="menu">
                        <li><a id="addCol"><i className="icon-note"/> Add Column</a></li>
                        <li><a id="addRow"><i className="icon-note"/> Add Row</a></li>
                        <li><a id="deleteRow"><i className="icon-trash"/> Delete Row</a></li>
                        <li><a id="deleteTable"><i className="icon-trash"/> Delete Table</a></li>
                    </ul>
                </div>
                <div id="contextMenu">
                    <ul className="dropdown-menu" role="menu">
                        <li><a id="editField"><i className="icon-pencil"/> Edit Field</a></li>
                        <li><a id="deleteField"><i className="icon-trash"/> Delete Field</a></li>
                    </ul>
                </div>
                <Modal ref="modalFieldDetail" portal="modalFieldDetail">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Modal Field Detail</h4>
                    </div>
                    <div className="modal-body">
                        <FieldDetail ref="fieldDetail" onSave={this._onSaveFieldDetail.bind(this)}/>
                    </div>
                </Modal>
                <Modal ref="modalAddFieldSection" portal="modalAddFieldSection">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">List Field</h4>
                    </div>
                    <div className="modal-body">
                        <ListField ref="listField" onSelectItem={this._onSelectField.bind(this)}/>
                    </div>
                </Modal>
                <Modal ref="modalUpdateSection" portal="modalUpdateSection">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Update Section</h4>
                    </div>
                    <div className="modal-body">
                        <UpdateSection ref="formUpdateSection" name={this.props.name}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" data-dismiss="modal" className="btn btn-default">Close</button>
                        <button type="button" className="btn btn-primary" onClick={this._onSaveUpdateSection.bind(this)}>Save</button>
                    </div>
                </Modal>
            	<div className="col-md-12 dragulaSection">
            		<div className="portlet box green" id={"dragulaSection_"+this.props.code}>
            			<div className="portlet-title">
                            <div className="caption">
                                {this.props.name}
                                &nbsp;
                                <span className="label label-sm label-primary dragulaSectionHandler">
                                    Drag here
                                </span>
                            </div>
                            <div className="tools">
                                <a className="collapse"></a>
                            </div>
                            <div className="actions">
                                <div className="btn-group">
                                    <a className="btn btn-default btn-sm" data-toggle="dropdown">
                                        Action&nbsp;
                                        <i className="fa fa-angle-down"></i>
                                    </a>
                                    <ul className="dropdown-menu pull-right">
                                        <li>
                                            <a onClick={this._onAddFieldSection.bind(this)}>
                                                <i className="fa fa-plus"></i> Add Field
                                            </a>
                                        </li>
                                        <li className="divider"/>
                                        <li>
                                            <a onClick={this._onEditSection.bind(this)}>
                                                <i className="fa fa-pencil"></i> Edit Section
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={this._onDeleteSection.bind(this)}>
                                                <i className="fa fa-trash-o"></i> Delete Section
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="portlet-body form flip-scroll">
                            <form className="form-horizontal">
                                <div className="form-body">
                                    <div className="row">
                                        {
                                            this.props.fields.map((field,index)=>{
                                                let tempField = field.get('code')
                                                if(tempField === 'itlh')
                                                    return <InputText key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        id={field.get('name')} 
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context="contextMenu"
                                                        ref={"field"+index}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem.bind(this)}/>
                                                else if(tempField === 'idlh')
                                                    return <InputDate key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        id={field.get('name')} 
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context="contextMenu"
                                                        ref={"field"+index}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem.bind(this)}/>
                                                else if(tempField === 'tlh')
                                                    return <TextArea key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        id={field.get('name')} 
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context="contextMenu"
                                                        ref={"field"+index}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem.bind(this)}/>
                                                else if(tempField === 'clh')
                                                    return <Checkbox key={index} type={tempField}
                                                        name={field.get('name')}
                                                        id={field.get('name')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context="contextMenu"
                                                        ref={"field"+index}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem.bind(this)}/>
                                                else if(tempField === 'label')
                                                    return <Label key={index} type={tempField}
                                                        label={field.get('label')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        size={field.get('size')}
                                                        context="contextMenu"
                                                        ref={"field"+index}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem.bind(this)}/>
                                                else if(tempField === 'table')
                                                    return <Table key={index} type={tempField}
                                                        content={field.get('content')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        context="contextTableMenu"
                                                        ref={"field"+index}
                                                        code={index}
                                                        onDeleteColumn={this._onDeleteColumn.bind(this)}
                                                        onUpdateColumn={this._onUpdateColumn.bind(this)}
                                                        onRightClickItem={this._onRightClickTableItem.bind(this)}/>
                                            })
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
            		</div>
            	</div>
            </div>
		)
	}
}

Section.propTypes = {
    name: React.PropTypes.string.isRequired,
    fields: React.PropTypes.object.isRequired,
    code: React.PropTypes.number.isRequired,
    onDeleteSection: React.PropTypes.func.isRequired,
    onUpdateSection: React.PropTypes.func.isRequired,
    onSelectField: React.PropTypes.func.isRequired,
    onSaveFieldDetail: React.PropTypes.func.isRequired,
    onDeleteField: React.PropTypes.func.isRequired,
    onAddTableColumn: React.PropTypes.func.isRequired,
    onAddTableRow: React.PropTypes.func.isRequired,
    onDeleteTableRow: React.PropTypes.func.isRequired,
    onDeleteTableColumn: React.PropTypes.func.isRequired,
    onUpdateTableColumn: React.PropTypes.func.isRequired,
    onDragField: React.PropTypes.func.isRequired,
    onDragSection: React.PropTypes.func.isRequired
}

export default Section