var CommonModal = require('common/modal');
var ComponentFormUpdateSection = require('modules/eform/eformTemplateDetail/formUpdateSection');
var ComponentFormUpdateViewType = require('modules/eform/eformTemplateDetail/formUpdateViewType');
var ComponentRow = require('modules/eform/eformTemplateDetail/row');
var CommonInput = require('common/inputText');
var CommonRadio = require('common/radio');

module.exports = React.createClass({
    viewTypeDynamic: undefined,
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
    checkShowHide: function(value){
        if(this.viewTypeDynamic === 'hide'){
            this.refs.radio_show.setChecked(true);
            this.refs.radio_hide.setChecked(false);
        }

    },
    componentDidMount: function() {
        if (this.props.permission === 'eformDev') {
            var self = this;
            this.refs.inputOrder.setValue(this.props.code);
            $(this.refs.tempRef).on('keypress', function(event){
                if(event.which == 13){
                    self.props.onChangeRef(self.props.code, event.target.value);
                    return false;
                }
            })
            $(this.refs.page).on('keypress', function(event){
                if(event.which == 13){
                    self.props.onChangePage(self.props.code, event.target.value)
                }
            })
        }else{
            if(this.props.viewType === 'dynamic'){
                $(this.refs.section).css('display', 'none');
                if(typeof this.viewTypeDynamic !== 'undefined' && this.viewTypeDynamic !== 'show'){
                    this.refs.radio_show.setChecked(false);
                    this.refs.radio_hide.setChecked(true);
                }else if(this.viewTypeDynamic === 'show'){
                    this.refs.radio_show.setChecked(true);
                    this.refs.radio_hide.setChecked(false);
                }else{
                    this.refs.radio_show.setChecked(false);
                    this.refs.radio_hide.setChecked(true);
                }
            }
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        if (this.props.permission === 'eformDev') {
        }
    },
    _onCreateRow: function(){
        this.props.onCreateRow(this.props.code, this.props.refTemp);
    },
    _onUpdateSection: function() {
        $(this.refs.modalUpdateSection).css({display: 'block'});
        this.refs.formUpdateSection.init();
    },
    _onRemoveSection: function() {
        this.props.onRemoveSection(this.props.code);
    },
    _onSaveUpdateSection: function() {
        var name = this.refs.formUpdateSection.getName();
        $(this.refs.modalUpdateSection).css({display: 'none'});
        this.props.onUpdateSection(this.props.code, name);
    },
    _onSaveUpdateViewType: function(){
        var viewType = this.refs.formUpdateViewType.getViewType();
        $(this.refs.modalUpdateViewType).css({display: 'none'})
        this.props.onUpdateViewType(this.props.code, viewType);
    },
    _onOrderSection: function(){
        $(this.refs.modalOrderSection).css({display: 'block'});
    },
    _onSaveInputOrder: function(){
        var value = this.refs.inputOrder.getValue();
        $(this.refs.modalOrderSection).css({display: 'none'});
        this.props.onOrderSection(this.props.code, value);
    },
    _onSelectField: function(codeSection, codeRow, refRow, type){
        this.props.onSelectField(codeSection, codeRow, this.props.refTemp, refRow, type);
    },
    _onUpdateViewType: function(){
        $(this.refs.modalUpdateViewType).css({display: 'block'});

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
        if(this.viewTypeDynamic !== 'hide'){
            for(var i = 0; i < rows.length; i++){
                var row = rows[i];
                var rowRef = row.ref;
                var tempFields = this.refs[rowRef].getAllFieldValueWithValidation(stringType);
                tempFields.map(function(field, index){
                    fields.push(field);
                })
            }
        }
        return fields;
    },
    _onChangeViewType: function(value){
        if(this.props.viewType !== 'static'){
            if(value === 'yes'){
                this.viewTypeDynamic = 'show';
                $(this.refs.section).css({display: 'block'});
            }else{
                this.viewTypeDynamic = 'hide';
                $(this.refs.section).css({display: 'none'});
            }
        }
    },
    preCalSum: function(rowRef, fieldRef, sumRef){
        this.refs[rowRef].preCalSum(fieldRef, sumRef);
    },
    preCalCount: function(rowRef, fieldRef, sumRef){
        this.refs[rowRef].preCalCount(fieldRef, sumRef);
    },
    preCalBelongsGroup(rowRef, fieldRef, group){
        this.refs[rowRef].preCalBelongsGroup(fieldRef, group);
    },
    render: function(){
        var displayPermission = (this.props.permission === 'eformDev')?'inline-block':'none';
        var displayViewType = (this.props.viewType !== 'static' && this.props.permission !== 'eformDev')?'inline-block':'none';
        if(typeof this.props.viewType === 'undefined') displayViewType = 'none';
        return (
                <div className="row">
                    <div ref="modalUpdateSection" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>Update Section</h4>
                        </div>
                        <div className="content">
                            <ComponentFormUpdateSection ref="formUpdateSection" name={this.props.name}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){$(this.refs.modalUpdateSection).css({display: 'none'})}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveUpdateSection}>Save</button>
                        </div>
                    </div>

                    {/*<CommonModal ref="modalUpdateSection">
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
                    </CommonModal>*/}


                    <div ref="modalUpdateViewType" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>Update View Type</h4>
                        </div>
                        <div className="content">
                            <ComponentFormUpdateViewType ref="formUpdateViewType" viewType={this.props.viewType}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){$(this.refs.modalUpdateViewType).css({display: 'none'})}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveUpdateViewType}>Save</button>
                        </div>
                    </div>

                    <div ref="modalOrderSection" className = "eform-dialog-fixed">
                        <div className="header">
                            <h4>Order Section</h4>
                        </div>
                        <div className="content">
                            <CommonInput ref="inputOrder"/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={function(){$(this.refs.modalOrderSection).css({display: 'none'})}.bind(this)} className="btn btn-default">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this._onSaveInputOrder}>Save</button>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div style={{display: displayViewType, marginBottom: '10px'}}>
                           <CommonRadio ref="radio_show" name={this.props.refTemp+'_viewType'} value="yes"
                                onChange={this._onChangeViewType}/> Show
                            &nbsp;
                           <CommonRadio ref="radio_hide" name={this.props.refTemp+'_viewType'} value="no"
                                onChange={this._onChangeViewType}/> Hide
                            &nbsp; <b>{this.props.name}</b>
                        </div>
                        <div className="portlet box green" ref="section">
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

                                        <a className="btn green btn-sm" onClick={this._onCreateRow}>
                                            <i className="fa fa-plus"></i> Add Row
                                        </a>&nbsp;
                                        
                                        <div className="btn-group">

                                            <a className="btn btn-default btn-sm" data-toggle="dropdown">
                                                Action&nbsp;
                                                <i className="fa fa-angle-down"></i>
                                            </a>

                                            <ul className="dropdown-menu pull-right">
                                                {/*
                                                <li>
                                                    <a onClick={this._onCreateRow}>
                                                        <i className="fa fa-plus"></i> Add Row
                                                    </a>
                                                </li>
                                                 */}

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
                                                    <a onClick={this._onUpdateViewType}>
                                                        <i className="fa fa-pencil"></i>Change View Type
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={this._onRemoveSection}>
                                                        <i className="fa fa-trash-o"></i> Remove Section
                                                    </a>
                                                </li>
                                                <li>
                                                    <a>
                                                        Page&nbsp;&nbsp;
                                                        <input type="text" ref="page" defaultValue={this.props.page}/>
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
                                                            moduleID={this.props.moduleID}
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
                                                            onChangeRefRow={this.props.onChangeRefRow}
                                                            onOrderRow={this.props.onOrderRow}
                                                            handleReloadDoctor = {this.props.handleReloadDoctor}
                                                            onOrderField = {this.props.onOrderField}
                                            />
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
