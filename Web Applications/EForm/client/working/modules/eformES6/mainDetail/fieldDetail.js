import InputText from 'common/inputText'
import Markdown from 'common/markdown'

class FieldDetail extends React.Component{
    constructor(){
        super()
        this.code = 0
        this.type = ''
    }
    init(object){
        this.type = object.type
        if(this.type !== 'label'){
            this.refs.formName.setValue(object.name)
            this.refs.formLabel.setValue(object.label)
        }else{
            this.refs.formEditorLabel.setValue(object.label)
            this.forceUpdate()
        }
        this.refs.formSize.setValue(object.size)
        this.code = object.code
    }
    _onSave(){
        const size = this.refs.formSize.getValue()
        let data = null
        if(this.type !== 'label'){
            const name = this.refs.formName.getValue()
            const label = this.refs.formLabel.getValue()
            data = {
                label: label, name: name, code: this.code, size: size, type: this.type
            }
        }else{
            const label = this.refs.formEditorLabel.getValue()
            data = {
                label: label, code: this.code, size: size, type: this.type
            }
        }
        this.props.onSave(data)
    }
	render(){
        let display_label = ''
        let display_other = ''
        if(this.type === 'label'){
            display_label = 'block'
            display_other = 'none'
        }else{
            display_label = 'none'
            display_other = 'block'
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group" style={{display: display_label }}>
                                <label>Label</label>
                                <Markdown ref="formEditorLabel"/>
                            </div>
                            <div className="form-group" style={{display: display_other }}>
                                <label>Label</label>
                                <InputText placeholder="Type label" ref="formLabel"/>
                            </div>
                            <div className="form-group" style={{display: display_other }}>
                                <label>Name</label>
                                <InputText placeholder="Type name" ref="formName"/>
                            </div>
                            <div className="form-group">
                                <label>Size</label>
                                <InputText placeholder="Type size" ref="formSize"/>
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

FieldDetail.propTypes = {
    onSave: React.PropTypes.func
}

export default FieldDetail