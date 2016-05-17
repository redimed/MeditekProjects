var CommonModal = require('common/modal');
var CommonInputText = require('common/inputText');
var CommonInputDate = require('common/inputDate');
var CommonCheckbox = require('common/checkbox');
var CommonYesNo = require('common/yesno');
var ComponentFormEditTableColumn = require('modules/eform/eformTemplateDetail/formUpdateTableColumn');

module.exports = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        context: React.PropTypes.string,
        code: React.PropTypes.any,
        type: React.PropTypes.string,
        name: React.PropTypes.string,
        groupId: React.PropTypes.string,
        onDeleteColumn: React.PropTypes.func,
        onUpdateColumn: React.PropTypes.func
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
        swal({
            title: 'Are you sure?',
            text: 'You will delete this column.',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            this.props.onDeleteColumn(this.props.code, code);
        }.bind(this))
    },
    _onSaveColumn: function(data){
        swal({
            title: 'Are you sure?',
            text: 'You will update this column of table.',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function(){
            this.refs.modalEditTableColumn.hide()
            this.props.onUpdateColumn(this.props.code, data);
        }.bind(this))
    },
    getAllValue: function(typeString){
        var content = this.props.content.toJS();
        var rows = content.rows;
        var cols = content.cols;
        var self = this;
        var results = [];
        var self = this;
        for(var i = 0; i < rows; i++){
            cols.map(function(col, indexCol){
                var refChild = "field_"+i+"_"+indexCol;
                if(col.type !== 'c'){
                    if(col.type === 'radio_yes_no'){
                        var refRadioChild = self.props.name+'_field_'+i+'_'+indexCol;
                        var value = self.refs[refRadioChild].getValue();
                    }
                    else{
                        if(typeString === 'print' && col.type === 'd'){
                            var value = self.refs[refChild].getValuePrint();
                        }else
                            var value = self.refs[refChild].getValue();
                    }
                }
                else
                    var value = self.refs[refChild].getValueTable();
                if(col.type === 'radio_yes_no'){
                    var typeChild = self.refs[refRadioChild].getType();
                    if(typeString !== 'print')
                        refChild = refRadioChild;
                }
                else
                    var typeChild = self.refs[refChild].getType();
                var type = 'table';
                var name = self.getName();
                results.push({refChild: refChild, value: value, type: 'table', typeChild: typeChild, ref: self.props.refTemp, name: name});
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
    render: function(){
        var content = this.props.content
        var rows = Immutable.List()
        for(var i = 0; i < content.get('rows'); i++){
            rows = rows.push(Immutable.Map({col: content.get('cols')}))
        }
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
                                </tr>
                            </thead>
                            <tbody ref="table">
                                {
                                    rows.map(function(row, indexRow){
                                        return (
                                            <tr key={indexRow}>
                                                {
                                                    row.get('col').map(function(c, indexCol){
                                                        var type = c.get('type');
                                                        if(type === 'it')
                                                            return (
                                                                <td key={indexCol}>
                                                                    <CommonInputText key={indexCol} type={type}
                                                                        ref={"field_"+indexRow+'_'+indexCol}
                                                                        code={indexCol}/>
                                                                </td>
                                                            )
                                                        else if(type === 'c')
                                                            return (
                                                                <td key={indexCol} style={{verticalAlign: 'middle'}}>
                                                                    <center>
                                                                        <span style={{verticalAlign: 'middle', display: 'inline-block', textAlign: 'center'}}>
                                                                            <CommonCheckbox key={indexCol} type={type}
                                                                                ref={"field_"+indexRow+'_'+indexCol}
                                                                                code={indexCol}/>
                                                                        </span>
                                                                    </center>
                                                                </td>
                                                            )
                                                        else if(type === 'd')
                                                            return (
                                                                <td key={indexCol} style={{verticalAlign: 'middle'}}>
                                                                    <center>
                                                                        <span style={{verticalAlign: 'middle', display: 'inline-block', textAlign: 'center'}}>
                                                                            <CommonInputDate key={indexCol} type={type}
                                                                                ref={"field_"+indexRow+'_'+indexCol}
                                                                                code={indexCol}/>
                                                                        </span>
                                                                    </center>
                                                                </td>
                                                            )
                                                        else if(type === 'radio_yes_no')
                                                            return (
                                                                <td key={indexCol} style={{verticalAlign: 'middle'}}>
                                                                    <center>
                                                                        <span style={{verticalAlign: 'middle', display: 'inline-block', textAlign: 'center'}}>
                                                                            <CommonYesNo key={indexCol} type={type}
                                                                                refTemp={this.props.name+"_field_"+indexRow+'_'+indexCol}
                                                                                ref={this.props.name+"_field_"+indexRow+'_'+indexCol}
                                                                                code={indexCol}/>
                                                                        </span>
                                                                    </center>
                                                                </td>
                                                            )
                                                    },this)
                                                }            
                                            </tr>
                                        )
                                    },this)   
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
	}
})