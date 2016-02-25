import InputText from 'common/inputText'

class UpdateSection extends React.Component{
    componentDidMount(){
        this.refs.inputName.setValue(this.props.name)
    }
    getName(){
        return this.refs.inputName.getValue()
    }
	render(){
		return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group">
                                <label>Section Name</label>
                                <InputText placeholder="Type Section Name" ref="inputName"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
		)
	}
}

UpdateSection.propTypes = {
    name: React.PropTypes.string.isRequired
}

export default UpdateSection