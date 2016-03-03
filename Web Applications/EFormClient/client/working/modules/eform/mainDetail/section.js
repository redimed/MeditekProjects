var CommonModal = require('common/modal');
var CommonInputText = require('common/inputText');
var CommonInputDate = require('common/inputDate');
var CommonTextArea = require('common/textarea');
var CommonCheckbox = require('common/checkbox');
var CommonRadio = require('common/radio');
var CommonLabel = require('common/label');
var CommonSignature = require('common/signature');
var CommonTable = require('modules/eform/mainDetail/tableField');
var ComponentFormUpdateSection = require('modules/eform/mainDetail/formUpdateSection');
var ComponentListField = require('modules/eform/mainDetail/listField');
var ComponentFieldDetail = require('modules/eform/mainDetail/fieldDetail');

module.exports = React.createClass({
	drakeSection: null,
	drakeField: null,
	propTypes: {
		code: React.PropTypes.number,
        type: React.PropTypes.string,
		onUpdateSection: React.PropTypes.func,
		onRemoveSection: React.PropTypes.func,
		onDragSection: React.PropTypes.func,
		onSelectField: React.PropTypes.func,
		onDragField: React.PropTypes.func,
		onRemoveField: React.PropTypes.func,
		onSaveFieldDetail: React.PropTypes.func,
		onCreateTableRow: React.PropTypes.func,
		onRemoveTableRow: React.PropTypes.func,
		onCreateTableColumn: React.PropTypes.func,
		onRemoveTableColumn: React.PropTypes.func,
		onUpdateTableColumn: React.PropTypes.func
	},
    getDefaultProps: function(){
        return {
            code: 0,
            type: 'dev'
        }
    },
	componentDidMount: function(){
        if(this.props.type === 'dev'){
            this._dragAndDropSections();
            this._dragAndDropFields();
        }
    },
    componentDidUpdate: function(prevProps,prevState){
        if(this.props.type === 'dev'){
            this.drakeSection.destroy();
            this.drakeField.destroy();
            this._dragAndDropSections();
            this._dragAndDropFields();
        }
    },
    _dragAndDropFields: function(){
    	var self = this;
    	this.drakeField = dragula([].slice.apply(document.querySelectorAll('.dragula')),{
            copy: true,
             revertOnSpill: true,  // spilling will put the element back where it was dragged from, if this is true
            removeOnSpill: true,
            invalid: function (el, handle) {
                return false; // don't prevent any drags from initiating by default
              }
        });
    	this.drakeField.on('drop', function(el,target,source,sibling){
    		if (el.parentNode == target) {
                target.removeChild(el)
            }
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
                    var targetArray = $(target).find('.form-group')
                    $.each(targetArray, function(index, value){
                        var tempId = $(value).attr('id')
                        if(tempId !== fromEl){
                            var fromArr = fromEl.split('_')
                            var toArr = tempId.split('_')
                            var fromObj = {codeSection: fromArr[1], codeField: fromArr[2]}
                            var toObj = {codeSection: toArr[1], codeField: toArr[2]}
                            self.props.onDragField(fromObj, toObj)
                        }
                    })
                }else{
                    swal("No change", "Form will refresh.", "success")
                }
            })
        })
    },
    _dragAndDropSections(){
    	var self = this;
    	this.drakeSection = dragula([].slice.apply(document.querySelectorAll('.dragulaSection')),{
            copy: false,
            revertOnSpill: true,
            moves: function(el, container, handle){
                return handle.className.indexOf('dragulaSectionHandler') > -1;
            }
        });
    	this.drakeSection.on('drop', function(el,target,source,sibling){
    		if (el.parentNode == target) {
                target.removeChild(el)
            }
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
                    var targetArray = $(target).find('.portlet')
                    $.each(targetArray, function(index, value){
                        var tempId = $(value).attr('id')
                        if(tempId !== fromEl){
                            var fromArr = fromEl.split('_')
                            var toArr = tempId.split('_')
                            var fromObj = {codeSection: fromArr[1]}
                            var toObj = {codeSection: toArr[1]}
                            self.props.onDragSection(fromObj, toObj)
                        }
                    })
                }else{
                    swal("No change", "Form will refresh.", "success")
                }
            })
        })
    },
	_onCreateFieldSection: function(){
		this.refs.modalCreateFieldSection.show();
	},
	_onUpdateSection: function(){
		this.refs.modalUpdateSection.show();
	},
	_onRemoveSection: function(){
		var self = this;
		swal({
            title: 'Are you sure?',
            text: 'You will delete section '+this.props.name,
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            self.props.onRemoveSection(self.props.code);
        })
	},
	_onSaveUpdateSection: function(){
		var name = this.refs.formUpdateSection.getName();
		var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will edit section '+this.props.name,
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            self.refs.modalUpdateSection.hide()
            self.props.onUpdateSection(self.props.code, name)
        })
	},
	_onComponentListFieldSelect: function(item){
		this.refs.modalCreateFieldSection.hide();
        this.props.onSelectField(this.props.code,item.get('code'));
	},
	_onRightClickItem: function(code, e, ref){
		var id = $(e.target).attr('id')
        if(typeof id === 'undefined')
            id = $(e.target).parent().attr('id')
        var type = this.refs[ref].getType();
        var label = this.refs[ref].getLabel();
        var size = this.refs[ref].getSize();
        var dataFieldDetail = null;
        if(type !== 'label' && type !== 'labelh'){
            var name = this.refs[ref].getName();
            if(type === 'rlh'){
                var value = this.refs[ref].getValue();
                dataFieldDetail = {
                    name: name, label: label, size: size, code: code, type: type, ref: ref, value: value
                }
            }else
                dataFieldDetail = {
                    name: name, label: label, size: size, code: code, type: type, ref: ref
                }
        }else{
            dataFieldDetail = {
                label: label, size: size, code: code, type: type, ref: ref
            }
        }
        switch(id){
            case 'editField':
                this.refs.modalFieldDetail.show();
                this.refs.fieldDetail.init(dataFieldDetail);
                break;
            case 'deleteField':
            	var self = this;
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete this field ?',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function(){
                    self.props.onRemoveField(self.props.code, code);
                })
                break;
        }
	},
	_onComponentFieldDetailSave: function(data){
		var self = this;
		swal({
            title: 'Are you sure?',
            text: 'You will edit this field',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            if(data.type === 'rlh'){
                self.refs[data.ref].setValue(data.value);
            }
            self.props.onSaveFieldDetail(self.props.code,data);
            self.refs.modalFieldDetail.hide()
        })
	},
	_onRightClickTableItem: function(code, e, refTemp){
		var id = $(e.target).attr('id');
        if(typeof id === 'undefined')
            id = $(e.target).parent().attr('id');
       	var ref = "field"+code;
       	var self = this;
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
                    self.props.onRemoveField(self.props.code, code);
                })
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
                    self.props.onCreateTableRow(self.props.code, code);
                })
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
                    self.props.onRemoveTableRow(self.props.code, code);
                })
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
                    self.props.onCreateTableColumn(self.props.code, code);
                })
                break;
                case 'editTable':
                    var name = self.refs[refTemp].getName();
                    var size = self.refs[refTemp].getSize();
                    self.refs.modalFieldDetail.show();
                    var dataFieldDetail = {name: name, size: size, code: code, type: 'table', ref: refTemp}
                    self.refs.fieldDetail.init(dataFieldDetail);
                break;
        }
	},
	_onDeleteColumn: function(codeField, codeColumn){
		this.props.onRemoveTableColumn(this.props.code, codeField, codeColumn);
	},
	_onUpdateColumn: function(codeField, data){
		this.props.onUpdateTableColumn(this.props.code, codeField, data);
	},
    getAllFieldValueWithValidation: function(){
        var fields = this.props.fields.toJS();
        var results = [];
        for(var i = 0; i < fields.length; i++){
            var field = fields[i];
            var fieldRef = field.ref;
            if(typeof this.refs[fieldRef] !== 'undefined'){
                var type = this.refs[fieldRef].getType();
                if(type !== 'table' && type !== 'label' && type !== 'labelh' && type !== 'rlh' && type !== 'idnl'){
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type});
                }else if(type === 'table'){
                    var tableFields = this.refs[fieldRef].getAllValue();
                    tableFields.map(function(tableField, index){
                        results.push(tableField);
                    })
                }else if(type === 'rlh'){
                    var isChecked = this.refs[fieldRef].isChecked();
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type, checked: isChecked});
                }else if(type === 'idnl'){
                    var value = this.refs[fieldRef].getText();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type});
                }else if(type === 'signature'){
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type});
                }
            }
        }
        return results;
    },
    setValue: function(fieldRef, value){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(value);
    },
    setValueForRadio(fieldRef){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setChecked();  
    },
    setValueForTable: function(fieldRef, fieldRefChild, value){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(fieldRefChild, value);
    },
	render: function(){
        var displayType = (this.props.type === 'dev')?'inline-block':'none';
        var displayContextMenu = (this.props.type === 'dev')?'contextMenu':'none';
        var displayContextTableMenu = (this.props.type === 'dev')?'contextTableMenu':'none';
		return (
			<div className="row">
				<div id="contextMenu">
                    <ul className="dropdown-menu" role="menu">
                        <li><a id="editField"><i className="icon-pencil"/> Edit Field</a></li>
                        <li><a id="deleteField"><i className="icon-trash"/> Delete Field</a></li>
                    </ul>
                </div>
                <div id="contextTableMenu">
                    <ul className="dropdown-menu" role="menu">
                        <li><a id="editTable"><i className="icon-calendar"/> Edit Table Name</a></li>
                        <li><a id="addCol"><i className="icon-note"/> Add Column</a></li>
                        <li><a id="addRow"><i className="icon-note"/> Add Row</a></li>
                        <li><a id="deleteRow"><i className="icon-trash"/> Delete Row</a></li>
                        <li><a id="deleteTable"><i className="icon-trash"/> Delete Table</a></li>
                    </ul>
                </div>
				<CommonModal ref="modalUpdateSection" portal="modalUpdateSection">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Update Section</h4>
                    </div>
                    <div className="modal-body">
                        <ComponentFormUpdateSection ref="formUpdateSection" name={this.props.name}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" data-dismiss="modal" className="btn btn-default">Close</button>
                        <button type="button" className="btn btn-primary" onClick={this._onSaveUpdateSection}>Save</button>
                    </div>
                </CommonModal>
                <CommonModal ref="modalCreateFieldSection" portal="modalCreateFieldSection">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">List Field</h4>
                    </div>
                    <div className="modal-body">
                        <ComponentListField ref="listField" onSelectItem={this._onComponentListFieldSelect}/>
                    </div>
                </CommonModal>
                <CommonModal ref="modalFieldDetail" portal="modalFieldDetail">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Modal Field Detail</h4>
                    </div>
                    <div className="modal-body">
                        <ComponentFieldDetail ref="fieldDetail" onSave={this._onComponentFieldDetailSave}/>
                    </div>
                </CommonModal>
				<div className="col-md-12 dragulaSection">
					<div className="portlet box green" id={"dragulaSection_"+this.props.code}>
						<div className="portlet-title">
							<div className="caption">
                                {this.props.name}
                                &nbsp;
                                <span className="label label-sm label-primary dragulaSectionHandler"
                                    style={{display: displayType}}>
                                    Drag here
                                </span>
                            </div>
                            <div className="tools" style={{display: displayType}}>
                                <a className="collapse"></a>
                            </div>
                            <div className="actions" style={{display: displayType}}>
                                <div className="btn-group">
                                    <a className="btn btn-default btn-sm" data-toggle="dropdown">
                                        Action&nbsp;
                                        <i className="fa fa-angle-down"></i>
                                    </a>
                                    <ul className="dropdown-menu pull-right">
                                        <li>
                                            <a onClick={this._onCreateFieldSection}>
                                                <i className="fa fa-plus"></i> Create Field
                                            </a>
                                        </li>
                                        <li className="divider"/>
                                        <li>
                                            <a onClick={this._onUpdateSection}>
                                                <i className="fa fa-pencil"></i> Update Section
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={this._onRemoveSection}>
                                                <i className="fa fa-trash-o"></i> Remove Section
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
	                                		this.props.fields.map(function(field,index){
	                                			var tempField = field.get('code')
                                                if(tempField === 'itlh' || tempField === 'itnl')
                                                    return <CommonInputText key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                else if(tempField === 'idlh' || tempField === 'idnl')
                                                    return <CommonInputDate key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                else if(tempField === 'tlh' || tempField === 'tnl')
                                                    return <CommonTextArea key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                else if(tempField === 'clh')
                                                    return <CommonCheckbox key={index} type={tempField}
                                                        name={field.get('name')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                else if(tempField === 'rlh')
                                                    return <CommonRadio key={index} type={tempField}
                                                        name={field.get('name')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        label={field.get('label')}
                                                        size={field.get('size')} 
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        value={field.get('value')}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                else if(tempField === 'label' || tempField === 'labelh')
                                                    return <CommonLabel key={index} type={tempField}
                                                        label={field.get('label')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        size={field.get('size')}
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                else if(tempField === 'table')
                                                    return <CommonTable key={index} type={tempField}
                                                        name={field.get('name')}
                                                        content={field.get('content')}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        context={displayContextTableMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onDeleteColumn={this._onDeleteColumn}
                                                        onUpdateColumn={this._onUpdateColumn}
                                                        onRightClickItem={this._onRightClickTableItem}/>
                                                else if(tempField === 'signature'){
                                                    return <CommonSignature key={index} type={tempField}
                                                        groupId={'fieldgroup_'+this.props.code+'_'+index}
                                                        name={field.get('name')}
                                                        size={field.get('size')}
                                                        context={displayContextMenu}
                                                        ref={field.get('ref')}
                                                        refTemp={field.get('ref')}
                                                        code={index}
                                                        onRightClickItem={this._onRightClickItem}/>
                                                }
                                                else if(tempField === 'break')
                                                    return <div key={index} style={{clear: 'both'}}/>
	                                		}, this)	
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
})