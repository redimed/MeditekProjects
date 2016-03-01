import Modal from 'common/modal'
import Pagebar from 'modules/eform/main/pagebar'
import FormCreate from 'modules/eform/main/formCreate'
import FormList from 'modules/eform/main/formList'

class Main extends React.Component{
	_onAddNewForm(){
		this.refs.modalAddForm.show()
	}
	_onSaveCreateForm(){
		this.refs.modalAddForm.hide()
		this.refs.formList.refresh()
		swal("Success!", "Your e-form has been created.", "success");
	}
	render(){
		return (
			<div className="page-content">
				<Modal ref="modalAddForm" portal="modalAddForm">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Modal Add Form</h4>
                    </div>
                    <div className="modal-body">
                        <FormCreate ref="formCreate"
                        	onSave={this._onSaveCreateForm.bind(this)}/>
                    </div>
                </Modal>
				<Pagebar ref="pagebar" onAddNewForm={this._onAddNewForm.bind(this)}/>
				<h3 className="page-title"> E-Form
                    <small> List all form exists</small>
                </h3>
                <FormList ref="formList"/>
			</div>
		)
	}
}

export default Main