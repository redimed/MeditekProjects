import InputText from 'common/inputText'
import EFormService from 'modules/eform/services'

class FormAdd extends React.Component{
    _onSave(){
        const name = this.refs.inputName.getValue()
        this._serverCreateForm({name:name})
    }
    _serverCreateForm(data){
        var self = this
        swal({
            title: 'Are you sure?',
            text: 'You will add new eform',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true,
            showLoaderOnConfirm: true
        }, function(){
            EFormService.formCreate(data)
            .then(function(response){
                self.props.onSave()
            })
        }.bind(this))
    }
	render(){
		return (
			<div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group">
                                <label>Form Name</label>
                                <InputText placeholder="Form Name..." ref="inputName"/>
                            </div>
                            <div className="form-group" style={{float:'right'}}>
                                <button type="button" data-dismiss="modal" className="btn btn-default">Close</button>
                                &nbsp;
                                <button type="button" className="btn btn-primary" onClick={this._onSave.bind(this)}>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
		)
	}
}

FormAdd.propTypes = {
    onSave: React.PropTypes.func.isRequired
}

export default FormAdd