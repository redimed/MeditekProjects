import Modal from 'common/modal'
import InputText from 'common/inputText'
import Checkbox from 'common/checkbox'
import FormEditTableColumn from 'modules/eform/mainDetail/formEditTableColumn'

class Table extends React.Component{
    componentDidMount(){
        $(this.refs.table).contextmenu({
            target: '#'+this.props.context,
            before: function(e, element, target) {
                e.preventDefault();
                return true;
            },
            onItem: function(element, e) {
                this.props.onRightClickItem(this.props.code, e)
            }.bind(this)
        })
        this.contextMenuColumn()
    }
    componentDidUpdate(prevProps, prevState){
        this.contextMenuColumn()
    }
    contextMenuColumn(){
        $('.context-col').contextmenu({
            target: '#contextColumnMenu',
            before: function(e, element, target) {                    
                e.preventDefault();
                return true;
            },
            onItem: function(element, e) {
                let menu = $(e.target).attr('id')
                if(typeof menu === 'undefined')
                    menu = $(e.target).parent().attr('id')
                const code = $(element[0]).attr('id')
                switch(menu){
                    case 'deleteCol':
                        this.execDeleteCol(code)
                        break
                    case 'editCol':
                        const col = this.props.content.get('cols').get(code)
                        this.refs.modalEditTableColumn.show()
                        this.refs.formEditTableColumn.init(col,code)
                        break
                }
            }.bind(this)
        })
    }
    execDeleteCol(code){
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
    }
    _onSaveColumn(data){
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
    }
	render(){
        const content = this.props.content
        let rows = Immutable.List()
        for(let i = 0; i < content.get('rows'); i++){
            rows = rows.push(Immutable.Map({col: content.get('cols')}))
        }
        return (
            <div className="col-md-12 dragula">
                <div id="contextColumnMenu">
                    <ul className="dropdown-menu" role="menu">
                        <li><a id="editCol"><i className="icon-pencil"/> Edit Column</a></li>
                        <li><a id="deleteCol"><i className="icon-trash"/> Delete Column</a></li>
                    </ul>
                </div>
                <Modal ref="modalEditTableColumn" portal="modalEditTableColumn">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Edit Column Table</h4>
                    </div>
                    <div className="modal-body">
                        <FormEditTableColumn ref="formEditTableColumn" onSave={this._onSaveColumn.bind(this)}/>
                    </div>
                </Modal>
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
                                    rows.map((row,index)=>{
                                        return (
                                            <tr key={index}>
                                                {
                                                    row.get('col').map((c,index)=>{
                                                        const type = c.get('type')
                                                        if(type === 'it')
                                                            return (
                                                                <td key={index}>
                                                                    <InputText key={index} type={type}
                                                                        ref={"fieldCol"+index}
                                                                        code={index}/>
                                                                </td>
                                                            )
                                                        else if(type === 'c')
                                                            return (
                                                                <td key={index} style={{verticalAlign: 'middle'}}>
                                                                    <center>
                                                                        <span style={{verticalAlign: 'middle', display: 'inline-block', textAlign: 'center'}}>
                                                                            <Checkbox key={index} type={type}
                                                                                ref={"fieldCol"+index}
                                                                                code={index}/>
                                                                        </span>
                                                                    </center>
                                                                </td>
                                                            )
                                                    })
                                                }            
                                            </tr>
                                        )
                                    })   
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
	}
}

Table.propTypes = {
    content: React.PropTypes.object.isRequired,
    context: React.PropTypes.string.isRequired,
    code: React.PropTypes.any.isRequired,
    groupId: React.PropTypes.string,
    onDeleteColumn: React.PropTypes.func.isRequired,
    onUpdateColumn: React.PropTypes.func.isRequired
}

export default Table