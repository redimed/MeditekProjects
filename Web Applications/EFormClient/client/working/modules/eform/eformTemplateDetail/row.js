var CommonModal = require('common/modal');
var CommonInputText = require('common/inputText');
var CommonButtonReloadDoctor = require('common/buttonReloadDoctor');
var CommonInputDate = require('common/inputDate');
var CommonTextArea = require('common/textarea');
var CommonCheckbox = require('common/checkbox');
var CommonRadio = require('common/radio');
var CommonLabel = require('common/label');
var CommonSignature = require('common/signature');
var CommonTable = require('modules/eform/eformTemplateDetail/tableField');
var CommonTableDynamic = require('common/dynamicTable');
var CommonSignatureDoctor = require('common/signatureDoctor');
var CommonSignaturePatient = require('common/signaturePatient');
var CommonLineChart = require('common/chart/line');
var ComponentFormUpdateSection = require('modules/eform/eformTemplateDetail/formUpdateSection');
var ComponentListField = require('modules/eform/eformTemplateDetail/listField');
var ComponentFieldDetail = require('modules/eform/eformTemplateDetail/fieldDetail');
var ComponentFieldDetailChart = require('modules/eform/eformTemplateDetail/fieldDetailChart');
var Config = require('config');

module.exports = React.createClass({
    currentSelectedField: null,
    componentDidMount: function(){
        const self = this;
        if(this.props.permission === 'eformDev'){
            this.refs.inputOrder.setValue(this.props.code);
            $(this.refs.tempRef).on('keypress', function(event){
                if(event.which == 13){
                    self.props.onChangeRefRow(self.props.codeSection, self.props.code, event.target.value);
                    return false;
                }
            })
        }
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
    getSize: function(){
        return this.props.size;
    },
    getValue: function(fieldRef){
       if(typeof this.refs[fieldRef] !== 'undefined'){
            if(typeof this.refs[fieldRef].getValue !== 'undefined')
                return this.refs[fieldRef].getValue(value);
        } 
    },
    setValue: function(fieldRef, value){
        if(typeof this.refs[fieldRef] !== 'undefined'){
            if(typeof this.refs[fieldRef].setValue !== 'undefined')
                this.refs[fieldRef].setValue(value);
        }
    },
    setDisplay: function(fieldRef, type){
        if(typeof this.refs[fieldRef] !== 'undefined'){
            if(typeof this.refs[fieldRef].setDisplay !== 'undefined')
                this.refs[fieldRef].setDisplay(type);
        }
    },
    setValueForRadio: function(fieldRef, fieldChecked){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setChecked(fieldChecked);
    },
    setValueForTable: function(fieldRef, fieldRefChild, value){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(fieldRefChild, value);
    },
    setValueForChart: function(fieldRef, field, chartType){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(field, chartType);
    },
    addRowForDynamicTable: function(field){
        if(typeof this.refs[field.fields[0].ref].addRowForDynamicTable !== 'undefined')
            this.refs[field.fields[0].ref].addRowForDynamicTable(field);
    },
    _onRemoveRow: function(){
        this.props.onRemoveRow(this.props.codeSection, this.props.code);
    },
    _onComponentListFieldSelect: function(item){
        // this.refs.modalCreateFieldSection.hide();
        this.props.onSelectField(this.props.codeSection, this.props.code, this.props.refTemp, item.get('code'));
    },
    _onComponentListFieldClose: function(){
        $(this.refs.modalCreateFieldSection).css({display: 'none'});
    },
    _onRightClickChartItem: function(code, e, ref){
        var id = $(e.target).attr('id')
        if (typeof id === 'undefined')
            id = $(e.target).parent().attr('id')
        var type = this.refs[ref].getType();
        var size = this.refs[ref].getSize();
        var roles = this.refs[ref].getRoles();
        var axisX = this.refs[ref].getAxisX().toJS();
        var title = this.refs[ref].getTitle();
        var subtitle = this.refs[ref].getSubtitle();
        var name = (typeof(this.refs[ref].getName)!=='undefined')?this.refs[ref].getName():'';
        var preCal = (typeof(this.refs[ref].getPreCal)!=='undefined')?this.refs[ref].getPreCal():'';
        var series = this.refs[ref].getSeries().toJS();
        var dataFieldDetail = null;
        dataFieldDetail = {
            size: size,
            code: code,
            type: type,
            ref: ref,
            name: name,
            preCal: preCal,
            roles: roles,
            axisX: axisX,
            title: title,
            subtitle: subtitle,
            series: series
        }
        switch(id){
            case 'editChart':
                this.refs.modalFieldDetailChart.show();
                this.refs.fieldDetailChart.init(dataFieldDetail);
                break;
            case 'deleteChart':
                this.props.onRemoveField(this.props.codeSection, this.props.code, code);
                break;
        }
    },
    _onRightClickItem: function(code, e, ref) {
        var id = $(e.target).attr('id')
        if (typeof id === 'undefined')
            id = $(e.target).parent().attr('id')
        var type = this.refs[ref].getType();
        var size = this.refs[ref].getSize();
        var roles = this.refs[ref].getRoles();
        var dataFieldDetail = null;
        if(Config.getPrefixField(type, 'eform_input') > -1){
            var name = (typeof(this.refs[ref].getName)!=='undefined')?this.refs[ref].getName():'';
            var preCal = (typeof(this.refs[ref].getPreCal)!=='undefined')?this.refs[ref].getPreCal():'';
            var cal = (typeof(this.refs[ref].getCal)!=='undefined')?this.refs[ref].getCal():'';
            dataFieldDetail = {
                size: size,
                code: code,
                type: type,
                ref: ref,
                name: name,
                preCal: preCal,
                cal: cal,
                roles: roles
            }
            switch (type) {
                case 'eform_input_text':
                    var fields = this.props.fields.toJS();
                    dataFieldDetail.labelPrefix = this.refs[ref].getLabelPrefix();
                    dataFieldDetail.labelSuffix = this.refs[ref].getLabelSuffix();
                    break;
                case 'eform_input_textarea':
                    dataFieldDetail.rows = this.refs[ref].getRows();
                    break;
                case 'eform_input_check_checkbox':
                case 'eform_input_check_radio':
                    dataFieldDetail.label = this.refs[ref].getLabel();
                    dataFieldDetail.value = this.refs[ref].getValue();
                    break;
                case 'eform_input_check_label':
                case 'eform_input_check_label_html':
                    dataFieldDetail.label = this.refs[ref].getLabel();
                    dataFieldDetail.value = this.refs[ref].getValue();
                    delete dataFieldDetail.name;
                    break;
                case 'eform_input_signature':
                    dataFieldDetail.height = this.refs[ref].getHeight();
                    break;
            }
            if(Config.getPrefixField(type, 'textarea') > -1){
                dataFieldDetail.rows = this.refs[ref].getRows();
            }
            if(Config.getPrefixField(type, 'check') > -1){
                dataFieldDetail.label = this.refs[ref].getLabel();
                dataFieldDetail.value = this.refs[ref].getValue();
            }
            if(Config.getPrefixField(type, 'label') > -1){
                delete dataFieldDetail.name;
            }
            if(Config.getPrefixField(type, 'signature') > -1){
                dataFieldDetail.height = this.refs[ref].getHeight();
            }
        } else if (Config.getPrefixField(type, 'button') > -1) {
            var name = (typeof(this.refs[ref].getName)!=='undefined')?this.refs[ref].getName():'';
            var preCal = (typeof(this.refs[ref].getPreCal)!=='undefined')?this.refs[ref].getPreCal():'';
            var cal = (typeof(this.refs[ref].getCal)!=='undefined')?this.refs[ref].getCal():'';
            dataFieldDetail = {
                size: size,
                code: code,
                type: type,
                ref: ref,
                name: name,
                preCal: preCal,
                cal: cal,
                roles: roles
            }
        }
        var self = this;
        switch (id) {
            case 'editField':
                $(this.refs.modalFieldDetail).css({display: 'block'});
                this.refs.fieldDetail.init(dataFieldDetail);
                setTimeout(function(){
                    $(self.refs.modalFieldDetail).scrollTop(60);

                },100)
                break;
            case 'deleteField':
                var self = this;
                self.props.onRemoveField(self.props.codeSection, self.props.code, code);
                break;
            case 'orderField':
                $(this.refs.modalOrderField).css({display: 'block'});
                this.currentSelectedField = dataFieldDetail;
                break;
        }
    },
    _onComponentFieldDetailSave: function(data) {
        this.props.onSaveFieldDetail(this.props.codeSection, this.props.code, data);
        $(this.refs.modalFieldDetail).css({display: 'none'});
    },
    _onComponentFieldDetailClose: function(){
         $(this.refs.modalFieldDetail).css({display: 'none'});
    },
    _onComponentFieldDetailChartSave: function(data) {
        this.props.onSaveFieldDetail(this.props.codeSection, this.props.code, data);
        this.refs.modalFieldDetailChart.hide();
    },
    _onDeleteColumn: function(codeField, codeColumn) {
        this.props.onRemoveTableColumn(this.props.codeSection, this.props.code, codeField, codeColumn);
    },
     _onUpdateColumn: function(codeField, data) {
        this.props.onUpdateTableColumn(this.props.codeSection, this.props.code, codeField, data);
    },
    _onRightClickTableItem: function(code, e, refTemp) {
        var id = $(e.target).attr('id');
        if (typeof id === 'undefined')
            id = $(e.target).parent().attr('id');
        var ref = "field" + code;
        var self = this;
        switch (id) {
            case 'deleteTable':
                self.props.onRemoveField(self.props.codeSection, self.props.code, code);
                break;
            case 'addRow':
                self.props.onCreateTableRow(self.props.codeSection, self.props.code, code);
                break;
            case 'deleteRow':
                self.props.onRemoveTableRow(self.props.codeSection, self.props.code, code);
                break;
            case 'addCol':
                self.props.onCreateTableColumn(self.props.codeSection, self.props.code, code);
                break;
            case 'editTable':
                var name = self.refs[refTemp].getName();
                var size = self.refs[refTemp].getSize();
                $(self.refs.modalFieldDetail).css({display: 'block'});
                var dataFieldDetail = { name: name, size: size, code: code, type: 'table', ref: refTemp }
                self.refs.fieldDetail.init(dataFieldDetail);
                break;
        }
    },
    getAllFieldValueWithValidation: function(stringType){
        var fields = this.props.fields.toJS();
        var results = [];
        var self = this;
        for(var i = 0; i < fields.length; i++){
            var field = fields[i];
            var fieldRef = field.ref;
            if(typeof this.refs[fieldRef] !== 'undefined'){
                var type = this.refs[fieldRef].getType();
                if(type !== 'table' && type !== 'dynamic_table' &&
                    type !== 'line_chart' &&
                    Config.getPrefixField(type, 'label') === -1 && 
                    Config.getPrefixField(type, 'check') === -1 && 
                    Config.getPrefixField(type, 'date') === -1 &&
                    Config.getPrefixField(field.type, 'signature') === -1){
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp, moduleID: this.props.moduleID});
                }else if(type === 'table'){
                    if(stringType === 'print'){
                        var tableFields = this.refs[fieldRef].getAllValue('print');
                    }else
                        var tableFields = this.refs[fieldRef].getAllValue('normal');
                    tableFields.map(function(tableField, index){
                        tableField.refRow = self.props.refTemp;
                        tableField.moduleID = self.props.moduleID;
                        results.push(tableField);
                    })
                }else if(Config.getPrefixField(type, 'checkbox') > -1 || Config.getPrefixField(type, 'radio') > -1){
                    var isChecked = this.refs[fieldRef].isChecked();
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    if(Config.getPrefixField(type, 'radio') === -1){
                        if(isChecked === true)
                            value = 'yes';
                        else
                            value = 'no';
                    }
                    results.push({value: value, name: name, ref: fieldRef, type: type, checked: isChecked, refRow: this.props.refTemp, moduleID: this.props.moduleID});
                }else if(Config.getPrefixField(type, 'date') > -1){
                    var value = this.refs[fieldRef].getText();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp, moduleID: this.props.moduleID});
                }else if(Config.getPrefixField(field.type, 'signature') > -1){
                    if(stringType !== 'print'){
                        var value = this.refs[fieldRef].getValue();
                        var name = this.refs[fieldRef].getName();
                        results.push({value: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp, moduleID: this.props.moduleID});
                    }
                    else{
                        var value = this.refs[fieldRef].getValue();
                        var name = this.refs[fieldRef].getName();
                        results.push({base64Data: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp, value: '', moduleID: this.props.moduleID});
                    }
                }else if(type === 'dynamic_table'){
                    var tableFields = this.refs[fieldRef].getAllValue();
                    tableFields.map(function(tableField, index){
                        tableField.refRow = self.props.refTemp;
                        results.push(tableField);
                    })      
                }else if(type === 'line_chart'){
                    if(stringType !== 'print'){
                        var series = this.refs[fieldRef].getAllValue();
                        series.refRow = this.props.refTemp;
                        results.push(series);
                    }else{
                        var series = this.refs[fieldRef].getBase64Value();
                        var base64DataHeader = series.base64DataHeader;
                        series.refRow = this.props.refTemp;
                        series.base64Data = series.value;
                        series.value = '';
                        series.moduleID = this.props.moduleID;
                        delete series.base64DataHeader;
                        results.push(series);
                        var series_1 = $.extend({}, series);
                        series_1.base64Data = base64DataHeader;
                        series_1.name = series_1.name+'_1';
                        results.push(series_1);
                    }
                }
            }
        }
        return results;
    },

    //tannv.dts@gmail.com
    getFieldsSelection: function () {
        var fields = this.props.fields.toJS();
        var results = [];
        var self = this;
        for(var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var fieldRef = field.ref;
            if(typeof this.refs[fieldRef] !== 'undefined'){
                if(this.refs[fieldRef].getIsSelected && this.refs[fieldRef].getIsSelected() == true) {
                    results.push({
                        codeField: this.refs[fieldRef].props.code,
                        codeRow: this.getCode()
                    })
                }
            }
        }
        return results;
    },

    unSelectFields: function () {
        var fields = this.props.fields.toJS();
        for(var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var fieldRef = field.ref;
            if(this.refs[fieldRef] && this.refs[fieldRef].getIsSelected && this.refs[fieldRef].getIsSelected()){
                if(this.refs[fieldRef].selection)
                    this.refs[fieldRef].selection();
            }
        }
    },



    _onSaveInputOrder: function(){
        var value = this.refs.inputOrder.getValue();
        $(this.refs.modalOrderRow).css({display: 'none'});
        this.props.onOrderRow(this.props.codeSection, this.props.code, value);
    },
    _onSaveInputOrderField: function() {
        var value = this.refs.inputOrderField.getValue();
        $(this.refs.modalOrderField).css({display: 'none'});
        this.props.onOrderField(this.props.codeSection, this.props.code, this.currentSelectedField.code, value);

    },

    _onSaveTableDynamicRow: function(codeField, fieldValues){
        this.props.onSaveTableDynamicRow(this.props.codeSection, this.props.code, codeField, fieldValues);
    },
    _onEditTableDynamicRow: function(codeField, position, fieldValues){
        this.props.onEditTableDynamicRow(this.props.codeSection, this.props.code, codeField, position, fieldValues);
    },
    _onRemoveTableDynamicRow: function(codeField, position){
        this.props.onRemoveTableDynamicRow(this.props.codeSection, this.props.code, codeField, position);
    },
    _onOpenModalAddField: function(){
        $(this.refs.modalCreateFieldSection).css({display: 'block'});
        this.refs.listField.init(this.props.fields);
    },
    bmi: function(fieldRef, calRes){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].bmi(calRes);
    },
    whr: function(fieldRef, calRes) {
        if(this.refs[fieldRef]) {
            this.refs[fieldRef].whr(calRes);
        }
    },
    maxHR: function(fieldRef, calRes) {
        if(this.refs[fieldRef]) {
            this.refs[fieldRef].maxHR(calRes);
        }
    },
    maxHR85: function(fieldRef, calRes) {
        if(this.refs[fieldRef]) {
            this.refs[fieldRef].maxHR85(calRes);
        }
    },
    triggerChange: function (fieldRef, calRes) {
        if(this.refs[fieldRef]) {
            this.refs[fieldRef].triggerChange(calRes);
        }
    },
    preCalSum: function(fieldRef, sumRef){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].onSum(sumRef);
    },
    preCalCount: function(fieldRef, sumRef){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].onCount(sumRef);
    },
    preCalBelongsGroup(fieldRef, group){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].onBelongsGroup(group);
    },
    render: function(){        
        var displayContextMenu = (this.props.permission === 'eformDev')?'contextMenu':'none';
        var displayContextChartMenu = (this.props.permission === 'eformDev')?'contextChartMenu':'none';
        var displayContextTableMenu = (this.props.permission === 'eformDev')?'contextTableMenu':'none';
        if(this.props.permission === 'eformDev'){
            var html = (
                <div className="row">
                    <div id="contextMenu">
                        <ul className="dropdown-menu" role="menu">
                            <li><a id="editField"><i className="icon-pencil"/> Edit Field</a></li>
                            <li><a id="orderField"><i className="icon-pencil"/> Order Field</a></li>
                            <li><a id="deleteField"><i className="icon-trash"/> Delete Field</a></li>
                        </ul>
                    </div>
                    <div id="contextChartMenu">
                        <ul className="dropdown-menu" role="menu">
                            <li><a id="editChart"><i className="icon-pencil"/> Edit Chart</a></li>
                            <li><a id="deleteChart"><i className="icon-trash"/> Delete Chart</a></li>
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
                    <div ref="modalCreateFieldSection" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>List Field</h4>
                        </div>
                        <div className="content">
                            <ComponentListField ref="listField" onSelectItem={this._onComponentListFieldSelect}
                                onCloseModal={this._onComponentListFieldClose}/>
                        </div>
                    </div>

                    <div ref="modalFieldDetail" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>Modal Field Detail</h4>
                        </div>
                        <div className="content">
                            <ComponentFieldDetail ref="fieldDetail" onSave={this._onComponentFieldDetailSave}
                                onCloseModal={this._onComponentFieldDetailClose}/>
                        </div>
                    </div>

                    <CommonModal ref="modalFieldDetailChart">
                        <div className="header">
                            <h4>Modal Field Detail</h4>
                        </div>
                        <div className="content">
                            <ComponentFieldDetailChart ref="fieldDetailChart" onSave={this._onComponentFieldDetailChartSave}
                                onCloseModal={function(){this.refs.modalFieldDetailChart.hide()}.bind(this)}/>
                        </div>
                    </CommonModal>

                    <div ref="modalOrderRow" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>Order Section</h4>
                        </div>
                        <div className="content">
                            <CommonInputText ref="inputOrder"/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){$(this.refs.modalOrderRow).css({display: 'none'})}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveInputOrder}>Save</button>
                        </div>
                    </div>

                    <div ref="modalOrderField" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>Order Field</h4>
                        </div>
                        <div className="content">
                            <CommonInputText ref="inputOrderField"/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){$(this.refs.modalOrderField).css({display: 'none'})}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveInputOrderField}>Save</button>
                        </div>
                    </div>
                    

                    <div className="col-md-12 dragRow">
                        <div className="portlet light" id={"dragRow_"+this.props.codeSection+'_'+this.props.code}>
                            <div className="portlet-title">
                                    <div className="caption">
                                            {/*<span className="label label-sm label-primary dragRowHandler">
                                                Drag here
                                            </span>*/}
                                        </div>
                                        <div className="tools">
                                            <a className="collapse"></a>
                                        </div>
                                        <div className="actions">
                                            <a className="btn btn-default btn-sm" onClick={this._onOpenModalAddField}>
                                                <i className="fa fa-plus"></i> Add Field
                                            </a>&nbsp;
                                            <div className="btn-group">

                                                <a className="btn btn-default btn-sm" data-toggle="dropdown">
                                                    Action&nbsp;
                                                    <i className="fa fa-angle-down"></i>
                                                </a>
                                                <ul className="dropdown-menu pull-right">
                                                    <li>
                                                        <a>
                                                            <input type="text" ref="tempRef" defaultValue={this.props.refTemp}/>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a onClick={function(){$(this.refs.modalOrderRow).css({display: 'block'})}.bind(this)} >
                                                            <i className="fa fa-plus"></i> Order Row
                                                        </a>
                                                    </li>
                                                    <li className="divider"/>
                                                    <li>
                                                        <a onClick={this._onRemoveRow}>
                                                            <i className="fa fa-trash-o"></i> Remove Row
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                           </div>
                            {/*<div className="portlet-body form flip-scroll">*/}
                            <div className="portlet-body form">
                                <div className="form-horizontal">
                                    <div className="form-body">
                                        <div className="row">
                                            {
                                                this.props.fields.map(function(field,index){
                                                    var type = field.get('type');
                                                    var groupId = 'fieldgroup_'+this.props.codeSection+'_'+this.props.code+'_'+index;
                                                    if(type === 'eform_input_text')
                                                            return <CommonInputText key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                labelPrefix={field.get('labelPrefix')}
                                                                labelSuffix={field.get('labelSuffix')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                preCal={field.get('preCal')}
                                                                cal={field.get('cal')}
                                                                onRightClickItem={this._onRightClickItem}/>
                                                    else if(type === 'eform_button_reload_doctor') {
                                                            return <CommonButtonReloadDoctor key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                preCal={field.get('preCal')}
                                                                cal={field.get('cal')}
                                                                onRightClickItem={this._onRightClickItem}
                                                                handleReloadDoctor = {this.props.handleReloadDoctor}
                                                            />
                                                    } else if(type === 'eform_input_date'){
                                                            return <CommonInputDate key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                roles={field.get('roles')}
                                                                refTemp={field.get('ref')}
                                                                preCal={field.get('preCal')}
                                                                cal={field.get('cal')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}/>
                                                    }else if(type === 'eform_input_textarea')
                                                            return <CommonTextArea key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                onRightClickItem={this._onRightClickItem}
                                                                preCal={field.get('preCal')}
                                                                cal={field.get('cal')}
                                                                rows={field.get('rows')}/>
                                                    else if(type === 'eform_input_check_checkbox')
                                                            return <CommonCheckbox key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                value={field.get('value')}
                                                                preCal={field.get('preCal')}
                                                                cal={field.get('cal')}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}/>
                                                    else if(type === 'eform_input_check_radio')
                                                            return <CommonRadio key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}
                                                                roles={field.get('roles')}
                                                                preCal={field.get('preCal')}
                                                                cal={field.get('cal')}
                                                                value={field.get('value')}/>
                                                    else if(type === 'eform_input_check_label')
                                                            return <CommonLabel key={index} type={type}
                                                                groupId={groupId}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}/>
                                                    else if(type === 'eform_input_check_label_html')
                                                            return <CommonLabel key={index} type={type}
                                                                groupId={groupId}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}/>
                                                    else if(type === 'dynamic_table')
                                                            return <CommonTableDynamic key={index} type={type}
                                                                name={field.get('name')}
                                                                permission={this.props.permission}
                                                                content={field.get('content')}
                                                                groupId={groupId}
                                                                context={displayContextTableMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                size={field.get('size')}
                                                                onDeleteColumn={this._onDeleteColumn}
                                                                onUpdateColumn={this._onUpdateColumn}
                                                                onRightClickItem={this._onRightClickTableItem}/>
                                                    else if(type === 'table')
                                                            return <CommonTable key={index} type={type}
                                                                name={field.get('name')}
                                                                permission={this.props.permission}
                                                                content={field.get('content')}
                                                                groupId={groupId}
                                                                context={displayContextTableMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                size={field.get('size')}
                                                                onDeleteColumn={this._onDeleteColumn}
                                                                onUpdateColumn={this._onUpdateColumn}
                                                                onRightClickItem={this._onRightClickTableItem}/>
                                                    else if(type === 'eform_input_signature')
                                                        return <CommonSignature key={index} type={type}
                                                            groupId={groupId}
                                                            permission={this.props.permission}
                                                            name={field.get('name')}
                                                            size={field.get('size')}
                                                            context={displayContextMenu}
                                                            ref={field.get('ref')}
                                                            refTemp={field.get('ref')}
                                                            code={index}
                                                            roles={field.get('roles')}
                                                            height={field.get('height')}
                                                            onRightClickItem={this._onRightClickItem}/>
                                                        else if(type === 'eform_input_image_doctor')
                                                            return <CommonSignatureDoctor key={index} type={type}
                                                                groupId={groupId}
                                                                permission={this.props.permission}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                type={type}
                                                                height={field.get('height')}
                                                                onRightClickItem={this._onRightClickItem}/>
                                                        else if(type === 'eform_input_image_patient')
                                                            return <CommonSignaturePatient key={index} type={type}
                                                                groupId={groupId}
                                                                permission={this.props.permission}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                type={type}
                                                                height={field.get('height')}
                                                                onRightClickItem={this._onRightClickItem}/>
                                                        else if(type === 'line_chart')
                                                            return <CommonLineChart key={index} type={type}
                                                                groupId={groupId}
                                                                permission={this.props.permission}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                context={displayContextChartMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                axisX={field.get('axisX')}
                                                                series={field.get('series')}
                                                                title={field.get('title')}
                                                                subtitle={field.get('subtitle')}
                                                                code={index}
                                                                roles={field.get('roles')}
                                                                height={field.get('height')}
                                                                onRightClickItem={this._onRightClickChartItem}/>
                                                }, this)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            var html = (
                <div className="row">
                    {
                            this.props.fields.map(function(field,index){
                                var type = field.get('type');
                                var groupId = 'fieldgroup_'+this.props.codeSection+'_'+this.props.code+'_'+index;
                                if(type === 'eform_input_text')
                                        return <CommonInputText key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            labelPrefix={field.get('labelPrefix')}
                                            labelSuffix={field.get('labelSuffix')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            preCal={field.get('preCal')}/>
                                else if (type === 'eform_button_reload_doctor')
                                        return <CommonButtonReloadDoctor key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            preCal={field.get('preCal')}
                                            handleReloadDoctor = {this.props.handleReloadDoctor}
                                        />
                                else if(type === 'eform_input_date')
                                        return <CommonInputDate key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}/>
                                else if(type === 'eform_input_textarea')
                                        return <CommonTextArea key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            rows={field.get('rows')}/>
                                else if(type === 'eform_input_check_checkbox')
                                        return <CommonCheckbox key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}
                                            value={field.get('value')}/>
                                else if(type === 'eform_input_check_radio')
                                        return <CommonRadio key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}
                                            value={field.get('value')}/>
                                else if(type === 'eform_input_check_label')
                                        return <CommonLabel key={index} type={type}
                                            groupId={groupId}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}/>
                                else if(type === 'eform_input_check_label_html')
                                        return <CommonLabel key={index} type={type}
                                            groupId={groupId}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}/>
                                else if(type === 'table')
                                        return <CommonTable key={index} type={type}
                                            name={field.get('name')}
                                            permission={this.props.permission}
                                            content={field.get('content')}
                                            groupId={groupId}
                                            context={displayContextTableMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            size={field.get('size')}
                                            onDeleteColumn={this._onDeleteColumn}
                                            onUpdateColumn={this._onUpdateColumn}
                                            onRightClickItem={this._onRightClickTableItem}/>
                                else if(type === 'dynamic_table')
                                    return <CommonTableDynamic key={index} type={type}
                                        name={field.get('name')}
                                        permission={this.props.permission}
                                        content={field.get('content')}
                                        groupId={groupId}
                                        context={displayContextTableMenu}
                                        ref={field.get('ref')}
                                        refTemp={field.get('ref')}
                                        code={index}
                                        size={field.get('size')}
                                        onDeleteColumn={this._onDeleteColumn}
                                        onSaveRow={this._onSaveTableDynamicRow}
                                        onEditRow={this._onEditTableDynamicRow}
                                        onRemoveRow={this._onRemoveTableDynamicRow}
                                        onUpdateColumn={this._onUpdateColumn}
                                        onRightClickItem={this._onRightClickTableItem}/>
                                else if(type === 'eform_input_signature')
                                    return <CommonSignature key={index} type={type}
                                        groupId={groupId}
                                        permission={this.props.permission}
                                        name={field.get('name')}
                                        size={field.get('size')}
                                        context={displayContextMenu}
                                        ref={field.get('ref')}
                                        refTemp={field.get('ref')}
                                        code={index}
                                        type={type}
                                        height={field.get('height')}
                                        onRightClickItem={this._onRightClickItem}/>
                                else if(type === 'eform_input_image_doctor')
                                    return <CommonSignatureDoctor key={index} type={type}
                                        groupId={groupId}
                                        permission={this.props.permission}
                                        name={field.get('name')}
                                        size={field.get('size')}
                                        context={displayContextMenu}
                                        ref={field.get('ref')}
                                        refTemp={field.get('ref')}
                                        code={index}
                                        type={type}
                                        height={field.get('height')}
                                        onRightClickItem={this._onRightClickItem}/>
                                else if(type === 'eform_input_image_patient')
                                    return <CommonSignaturePatient key={index} type={type}
                                        groupId={groupId}
                                        permission={this.props.permission}
                                        name={field.get('name')}
                                        size={field.get('size')}
                                        context={displayContextMenu}
                                        ref={field.get('ref')}
                                        refTemp={field.get('ref')}
                                        code={index}
                                        type={type}
                                        height={field.get('height')}
                                        onRightClickItem={this._onRightClickItem}/>
                                else if(type === 'line_chart')
                                    return <CommonLineChart key={index} type={type}
                                        groupId={groupId}
                                        permission={this.props.permission}
                                        name={field.get('name')}
                                        size={field.get('size')}
                                        context={displayContextChartMenu}
                                        ref={field.get('ref')}
                                        refTemp={field.get('ref')}
                                        axisX={field.get('axisX')}
                                        series={field.get('series')}
                                        title={field.get('title')}
                                        subtitle={field.get('subtitle')}
                                        code={index}
                                        roles={field.get('roles')}
                                        height={field.get('height')}
                                        onRightClickItem={this._onRightClickChartItem}/>
                            }, this)
                        }
                </div>
            )
        }
        return html;
    }
})
