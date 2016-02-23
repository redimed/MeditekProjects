import Dropdown from 'common/dropdown'
import InputText from 'common/InputText'

class FormEditColumnTable extends React.Component{
    constructor(){
        super()
        this.types = [
            {code: 'it', name: 'Input Text'},
            {code: 'c', name: 'Checkbox'}
        ]
        this.code = ''
    }
    init(col, code){
        this.refs.formLabel.setValue(col.get('label'))
        this.refs.formType.setValue(col.get('type'))
        this.code = code
    }
    _onSave(){
        const label = this.refs.formLabel.getValue()
        const type = this.refs.formType.getValue()
        const data = {
            label: label, type: type, code: this.code
        }
        this.props.onSave(data)
    }
	render(){
		return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group">
                                <label>Label Column</label>
                                <InputText placeholder="Type label" ref="formLabel"/>
                            </div>
                            <div className="form-group">
                                <label>Type Column</label>
                                <Dropdown ref="formType" code="code" name="name" list={this.types}/>                 
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

FormEditColumnTable.propTypes = {
    onSave: React.PropTypes.func.isRequired
}

export default FormEditColumnTable