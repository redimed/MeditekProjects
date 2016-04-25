var CommonModal = require('common/modal');
var ComponentFormUpdateSection = require('modules/eform/eformTemplateDetail/formUpdateSection');
var ComponentRow = require('modules/eform/eformTemplateDetail/row');
var CommonInput = require('common/inputText');

module.exports = React.createClass({
    propTypes: {
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        page: React.PropTypes.number,
        rows: React.PropTypes.object,
        refTemp: React.PropTypes.string,
        permission: React.PropTypes.string,
        onUpdateSection: React.PropTypes.func,
        onRemoveSection: React.PropTypes.func,
        onDragSection: React.PropTypes.func,
        onDragRow: React.PropTypes.func,
        onCreateRow: React.PropTypes.func,
        onRemoveRow: React.PropTypes.func,
        onSelectField: React.PropTypes.func,
        onSaveFieldDetail: React.PropTypes.func,
        onRemoveField: React.PropTypes.func,
        onRemoveTableColumn: React.PropTypes.func,
        onCreateTableColumn: React.PropTypes.func,
        onCreateTableRow: React.PropTypes.func,
        onRemoveTableRow: React.PropTypes.func,
        onUpdateTableColumn: React.PropTypes.func,
        onChangePage: React.PropTypes.func,
        onOrderSection: React.PropTypes.func,
        onOrderRow: React.PropTypes.func
    },
    getCode: function(){
        return this.props.code;
    },
    getRef: function(){
        return this.props.refTemp;
    },
    getType: function(){
        return this.props.type;
    },
    getPermission: function(){
        return this.props.permission;
    },
    getPage: function(){
        return this.props.page;
    },
    componentDidMount: function() {
        if (this.props.permission === 'eformDev') {
            this.refs.inputOrder.setValue(this.props.code);
            var self = this;
            //this._dragAndDropSections();
            //this._dragAndDropRows();

            $(this.refs.page).val(this.props.page);
            $(this.refs.page).keypress(function(event){
                if(event.which == 13){
                    self.props.onChangePage(self.props.code, event.target.value);
                }
            });
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        if (this.props.permission === 'eformDev') {
            //this.drakeSection.destroy();
            //this.drakeRow.destroy();
            //this._dragAndDropSections();
            //this._dragAndDropRows();
        }
    },
    _dragAndDropSections: function() {
        var self = this;
        this.drakeSection = dragula([].slice.apply(document.querySelectorAll('.dragSection')), {
            copy: false,
            revertOnSpill: true,
            moves: function(el, container, handle) {
                return handle.className.indexOf('dragSectionHandler') > -1;
            }
        });
        this.drakeSection.on('drop', function(el, target, source, sibling) {
            if (el.parentNode == target) {
                target.removeChild(el)
            }
            var fromEl = el.id
            var targetArray = $(target).find('.portlet')
            $.each(targetArray, function(index, value) {
                var tempId = $(value).attr('id')
                if (tempId !== fromEl) {
                    var fromArr = fromEl.split('_')
                    var toArr = tempId.split('_')
                    var fromObj = { codeSection: fromArr[1] }
                    var toObj = { codeSection: toArr[1] };
                    self.props.onDragSection(fromObj, toObj);
                    return false;
                }
            })
            /*swal({
                title: 'Are you sure?',
                text: 'You will change this section',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    var fromEl = el.id
                    var targetArray = $(target).find('.portlet')
                    $.each(targetArray, function(index, value) {
                        var tempId = $(value).attr('id')
                        if (tempId !== fromEl) {
                            var fromArr = fromEl.split('_')
                            var toArr = tempId.split('_')
                            var fromObj = { codeSection: fromArr[1] }
                            var toObj = { codeSection: toArr[1] };
                            self.props.onDragSection(fromObj, toObj);
                            return false;
                        }
                    })
                } else {
                    swal("No change", "Form will refresh.", "success")
                }
            })*/
            var fromEl = el.id
            var targetArray = $(target).find('.portlet')
            $.each(targetArray, function(index, value) {
                var tempId = $(value).attr('id')
                if (tempId !== fromEl) {
                    var fromArr = fromEl.split('_')
                    var toArr = tempId.split('_')
                    var fromObj = { codeSection: fromArr[1] }
                    var toObj = { codeSection: toArr[1] };
                    self.props.onDragSection(fromObj, toObj);
                    return false;
                }
            })//end each
        })
    },
    _dragAndDropRows: function() {        
        var self = this;
        this.drakeRow = dragula([].slice.apply(document.querySelectorAll('.dragRow')), {
            copy: true,
            revertOnSpill: true, // spilling will put the element back where it was dragged from, if this is true
            removeOnSpill: true,
            moves: function(el, container, handle) {
                return handle.className.indexOf('dragRowHandler') > -1;
            }
        });
        this.drakeRow.on('drop', function(el, target, source, sibling) {
            if (el.parentNode == target) {
                target.removeChild(el)
            }
            swal({
                title: 'Are you sure?',
                text: 'You will change this row',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    var fromEl = el.id;
                    var targetArray = $(target).find('.form-group')
                    $.each(targetArray, function(index, value) {
                        var tempId = $(value).attr('id')
                        if (tempId !== fromEl) {
                            var fromArr = fromEl.split('_')
                            var toArr = tempId.split('_')
                            var fromObj = { codeSection: fromArr[1], codeRow: fromArr[2] }
                            var toObj = { codeSection: toArr[1], codeRow: toArr[2] }
                            self.props.onDragRow(fromObj, toObj);
                            return false;
                        }
                    })
                } else {
                    swal("No change", "Form will refresh.", "success")
                }
            })
        })
    },
    _onCreateRow: function(){
        var self = this;
        self.props.onCreateRow(self.props.code, self.props.refTemp);
        /*self.props.onCreateRow(self.props.code, self.props.refTemp);
        swal({
            title: 'Are you sure?',
            text: 'You will create new row',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function() {
            self.props.onCreateRow(self.props.code, self.props.refTemp);
        })*/
    },
    _onUpdateSection: function() {
        this.refs.modalUpdateSection.show();
    },
    _onRemoveSection: function() {
        var self = this;
        self.props.onRemoveSection(self.props.code);
        /*swal({
            title: 'Are you sure?',
            text: 'You will delete section ' + this.props.name,
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function() {
            self.props.onRemoveSection(self.props.code);
        })*/
    },
    _onSaveUpdateSection: function() {
        var name = this.refs.formUpdateSection.getName();
        var self = this;
        self.refs.modalUpdateSection.hide();
        self.props.onUpdateSection(self.props.code, name);
        /*swal({
            title: 'Are you sure?',
            text: 'You will update section ' + this.props.name,
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function() {
            self.refs.modalUpdateSection.hide();
            self.props.onUpdateSection(self.props.code, name);
        })*/
    },
    _onOrderSection: function(){
        this.refs.modalOrderSection.show();
    },
    _onSaveInputOrder: function(){
        var value = this.refs.inputOrder.getValue();
        this.refs.modalOrderSection.hide();
        this.props.onOrderSection(this.props.code, value);
    },
    _onSelectField: function(codeSection, codeRow, refRow, type){
        this.props.onSelectField(codeSection, codeRow, this.props.refTemp, refRow, type);
    },
    setValue: function(refRow, fieldRef, value){
        if(typeof this.refs[refRow] !== 'undefined')
            this.refs[refRow].setValue(fieldRef, value);
    },
    setDisplay: function(refRow, fieldRef, type){
        if(typeof this.refs[refRow] !== 'undefined')
            this.refs[refRow].setDisplay(fieldRef, type);
    },
    setValueForRadio: function(refRow, fieldRef, fieldChecked){
        if(typeof this.refs[refRow] !== 'undefined')
            this.refs[refRow].setValueForRadio(fieldRef, fieldChecked);
    },
    setValueForTable: function(refRow, fieldRef, fieldRefChild, value){
        if(typeof this.refs[refRow] !== 'undefined')
            this.refs[refRow].setValueForTable(fieldRef, fieldRefChild, value);
    },
    setValueForChart: function(refRow, fieldRef, field, chartType){
        if(typeof this.refs[refRow] !== 'undefined'){
                this.refs[refRow].setValueForChart(fieldRef, field, chartType);
        }
    },
    addRowForDynamicTable: function(field){
        if(typeof this.refs[field.fields[0].refRow] !== 'undefined')
            this.refs[field.fields[0].refRow].addRowForDynamicTable(field);
    },
    getAllFieldValueWithValidation: function(stringType){
        var rows = this.props.rows.toJS();
        var fields = [];
        for(var i = 0; i < rows.length; i++){
            var row = rows[i];
            var rowRef = row.ref;
            var tempFields = this.refs[rowRef].getAllFieldValueWithValidation(stringType);
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }
        return fields;
    },
    render: function(){
        var displayPermission = (this.props.permission === 'eformDev')?'inline-block':'none';
        return (
                <div className="row">
                    <CommonModal ref="modalUpdateSection">
                        <div className="header">
                            <h4>Update Section</h4>
                        </div>
                        <div className="content">
                            <ComponentFormUpdateSection ref="formUpdateSection" name={this.props.name}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){this.refs.modalUpdateSection.hide()}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveUpdateSection}>Save</button>
                        </div>
                    </CommonModal>
                    <CommonModal ref="modalOrderSection">
                        <div className="header">
                            <h4>Order Section</h4>
                        </div>
                        <div className="content">
                            <CommonInput ref="inputOrder"/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){this.refs.modalOrderSection.hide()}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveInputOrder}>Save</button>
                        </div>
                    </CommonModal>
                    <div className="col-md-12 dragSection">
                        <div className="portlet box green" id={"dragSection_"+this.props.code}>
                            <div className="portlet-title">
                                <div className="caption">
                                        {this.props.name}
                                        &nbsp;
                                        {/*<span className="label label-sm label-primary dragSectionHandler"
                                            style={{display: displayPermission}}>
                                            Drag here
                                        </span>*/}
                                    </div>
                                    <div className="tools" style={{display: displayPermission}}>
                                        <a className="collapse"></a>
                                    </div>
                                    <div className="actions" style={{display: displayPermission}}>
                                        <div className="btn-group">
                                            <a className="btn btn-default btn-sm" data-toggle="dropdown">
                                                Action&nbsp;
                                                <i className="fa fa-angle-down"></i>
                                            </a>                                            
                                            <ul className="dropdown-menu pull-right">
                                                <li>
                                                    <a onClick={this._onCreateRow}>
                                                        <i className="fa fa-plus"></i> Add Row
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={this._onOrderSection}>
                                                        <i className="fa fa-sort"></i> Order Section
                                                    </a>
                                                </li>
                                                <li>
                                                    <a>
                                                        <input type="text" ref="tempRef" defaultValue={this.props.refTemp}/>
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
                            <div className="form-horizontal">
                                <div className="form-body">
                                    {
                                        this.props.rows.map(function(row, index){
                                            return <ComponentRow
                                                            key={index}
                                                            code={index}
                                                            codeSection={this.props.code}
                                                            ref={row.get('ref')}
                                                            size={row.get('size')}
                                                            refTemp={row.get('ref')}
                                                            type={row.get('type')}
                                                            fields={row.get('fields')}
                                                            permission={this.props.permission}
                                                            onRemoveRow={this.props.onRemoveRow}
                                                            onSelectField={this._onSelectField}
                                                            onSaveFieldDetail={this.props.onSaveFieldDetail}
                                                            onRemoveField={this.props.onRemoveField}
                                                            onRemoveTableColumn={this.props.onRemoveTableColumn}
                                                            onUpdateTableColumn={this.props.onUpdateTableColumn}
                                                            onCreateTableColumn={this.props.onCreateTableColumn}
                                                            onCreateTableRow={this.props.onCreateTableRow}
                                                            onRemoveTableRow={this.props.onRemoveTableRow}
                                                            onSaveTableDynamicRow={this.props.onSaveTableDynamicRow}
                                                            onEditTableDynamicRow={this.props.onEditTableDynamicRow}
                                                            onRemoveTableDynamicRow={this.props.onRemoveTableDynamicRow}
                                                            onOrderRow={this.props.onOrderRow}/>
                                        }, this)
                                    }
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
            )
        }
})