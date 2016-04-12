var CommonModal = require('common/modal');
var CommonInputText = require('common/inputText');
var CommonCheckbox = require('common/checkbox');
var CommonYesNo = require('common/yesno');
var ComponentFormEditTableColumn = require('modules/eform/eformTemplateDetail/formUpdateTableColumn');
var TableDynamicAddRow = require('common/table/tableDynamicAddRow');
var TableDynamicEditRow = require('common/table/tableDynamicEditRow');

module.exports = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        context: React.PropTypes.string,
        code: React.PropTypes.any,
        type: React.PropTypes.string,
        name: React.PropTypes.string,
        groupId: React.PropTypes.string,
        onDeleteColumn: React.PropTypes.func,
        onUpdateColumn: React.PropTypes.func,
        onSaveRow: React.PropTypes.func
    },
    getType: function(){
        return this.props.type;
    },
    componentDidMount: function(){
        if(this.props.context !== 'none'){
            $(this.refs.table).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) {
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
                }.bind(this)
            })
            this.contextMenuColumn();
        }
    },
    componentDidUpdate: function(prevProps, prevState){
        this.contextMenuColumn();
    },
    contextMenuColumn: function(){
        var self = this;
        $(this.refs.table).find('.context-col').contextmenu({
            target: this.refs.contextColumnMenu,
            before: function(e, element, target) {
                e.preventDefault();
                return true;
            },
            onItem: function(element, e) {
                var menu = $(e.target).attr('id')
                if(typeof menu === 'undefined')
                    menu = $(e.target).parent().attr('id')
                var code = $(element[0]).attr('id')
                switch(menu){
                    case 'deleteCol':
                        this.execDeleteCol(code);
                        break;
                    case 'editCol':
                        var col = this.props.content.get('cols').get(code);
                        this.refs.modalEditTableColumn.show();
                        this.refs.formEditTableColumn.init(col,code);
                        break;
                }
            }.bind(this)
        })
    },
    execDeleteCol: function(code){
        this.props.onDeleteColumn(this.props.code, code);
    },
    _onSaveColumn: function(data){
        this.refs.modalEditTableColumn.hide()
        this.props.onUpdateColumn(this.props.code, data);
    },
    getAllValue: function(){
        var content = this.props.content.toJS();
        var rows = content.rows;
        var cols = content.cols;
        var self = this;
        var results = [];
        var self = this;
        for(var i = 0; i < rows; i++){
            cols.map(function(col, indexCol){
                var refChild = "field_"+i+"_"+indexCol;
                if(col.type !== 'c')
                    var value = self.refs[refChild].getValue();
                else
                    var value = self.refs[refChild].getValueTable();
                var typeChild = self.refs[refChild].getType();
                var type = 'table';
                var name = self.getName();
                results.push({refChild: refChild, value: value, type: type, typeChild: typeChild, ref: self.props.refTemp, name: name});
            })
        }
        return results;
    },
    getName: function(){
        return this.props.name;
    },
    getSize: function(){
        return  this.props.size;
    },
    setValue: function(fieldRef, value){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(value);
    },
    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.table).attr('disabled', true);
        }else{
            $(this.refs.table).css('display', 'none');
        }
    },
    _onAddTableRow: function(){
        this.refs.modalAddRow.show();
        this.refs.tableDynamicAddRow.init(this.props.content);
    },
    _onSaveRow: function(fields){
        this.props.onSaveRow(this.props.code, fields);
        this.refs.modalAddRow.hide();
    },
    _onEditRow: function(fields, position){
       this.props.onEditRow(this.props.code, position, fields);
        this.refs.modalEditRow.hide(); 
    },
    _onClickEdit: function(item, position){
        this.refs.modalEditRow.show();
        this.refs.tableDynamicEditRow.init(item, position);
    },
    _onRemove: function(position){
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will delete row',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            self.props.onRemoveRow(self.props.code, position);
        })
    },
    render: function(){
        var content = this.props.content
        return (
            <div className="col-md-12 dragField" ref="table">
                <div ref="contextColumnMenu">
                    <ul className="dropdown-menu" role="menu">
                        <li><a id="editCol"><i className="icon-pencil"/> Edit Column</a></li>
                        <li><a id="deleteCol"><i className="icon-trash"/> Delete Column</a></li>
                    </ul>
                </div>
                <CommonModal ref="modalEditTableColumn">
                    <div className="header">
                        <h4 className="modal-title">Edit Column Table</h4>
                    </div>
                    <div className="content">
                        <ComponentFormEditTableColumn ref="formEditTableColumn" onSave={this._onSaveColumn}
                            onCloseModal={function(){this.refs.modalEditTableColumn.hide()}.bind(this)}/>
                    </div>
                </CommonModal>
                <CommonModal ref="modalAddRow">
                    <div className="header">
                        <h4 className="modal-title">Modal Detail</h4>
                    </div>
                    <div className="content">
                        <TableDynamicAddRow ref="tableDynamicAddRow" onCloseModal={function(){this.refs.modalAddRow.hide()}.bind(this)}
                            onSave={this._onSaveRow}/>
                    </div>
                </CommonModal>
                <CommonModal ref="modalEditRow">
                    <div className="header">
                        <h4 className="modal-title">Modal Detail</h4>
                    </div>
                    <div className="content">
                        <TableDynamicEditRow ref="tableDynamicEditRow" onCloseModal={function(){this.refs.modalEditRow.hide()}.bind(this)}
                            onSave={this._onEditRow}/>
                    </div>
                </CommonModal>
                <div className="row">
                    <div className="col-md-12" style={{textAlign: 'right'}}>
                        <button className="btn btn-primary" onClick={this._onAddTableRow}>Add Row</button>
                    </div>
                </div>
                <div className="form-group" id={this.props.groupId}>
                    <div className="col-md-12">
                        <table className="table table-bordered table-striped table-condensed flip-content">
                            <thead className="flip-content">
                                <tr>
                                    {
                                        content.get('cols').map((row,index)=>{
                                            return <th id={index} className="bg-blue-dark bg-font-blue-dark context-col" key={index}>{row.get('label')}</th>
                                        })
                                    }
                                    <th className="bg-blue-dark bg-font-blue-dark context-col">Action</th>
                                </tr>
                            </thead>
                            <tbody ref="table">
                                {
                                    content.get('rows').map(function(row, indexRow){
                                        return (
                                            <tr key={indexRow}>
                                                {
                                                    row.get('fields').map(function(field, indexField){
                                                        return (
                                                            <td key={indexField}>
                                                                {field.get('value')}
                                                            </td>
                                                        )
                                                    })
                                                }
                                                <td>
                                                    <a onClick={this._onClickEdit.bind(this, row, indexRow)}>Edit</a>
                                                    &nbsp;|&nbsp;
                                                    <a onClick={this._onRemove.bind(this, indexRow)}>Remove</a>
                                                </td>
                                            </tr>
                                        )
                                    }, this)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
})