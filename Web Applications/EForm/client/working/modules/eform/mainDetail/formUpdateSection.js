var CommonInputText = require('common/inputText');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string
    },
    componentDidMount: function(){
        this.refs.inputName.setValue(this.props.name)
    },
    getName: function(){
        return this.refs.inputName.getValue()
    },
	render: function(){
		return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group">
                                <label>Section Name</label>
                                <CommonInputText placeholder="Type Section Name" ref="inputName"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
		)
	}
})