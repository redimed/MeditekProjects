var CommonDropdown = require('common/dropdown');
var CommonInputText = require('common/inputText');

module.exports = React.createClass({
    types: [
        {code: 'it', name: 'Input Text'},
        {code: 'c', name: 'Checkbox'}
    ],
    code: '',
    propTypes: {
        onSave: React.PropTypes.func.isRequired
    },
    init: function(col, code){
        this.refs.formLabel.setValue(col.get('label'))
        this.refs.formType.setValue(col.get('type'))
        this.code = code
    },
    _onSave: function(){
        var label = this.refs.formLabel.getValue()
        var type = this.refs.formType.getValue()
        var data = {
            label: label, type: type, code: this.code
        }
        this.props.onSave(data)
    },
	render: function(){
		return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group">
                                <label>Label Column</label>
                                <CommonInputText placeholder="Type label" ref="formLabel"/>
                            </div>
                            <div className="form-group">
                                <label>Type Column</label>
                                <CommonDropdown ref="formType" code="code" name="name" list={this.types}/>                 
                            </div>
                            <div className="form-group" style={{float:'right'}}>
                                <button type="button" data-dismiss="modal" className="btn btn-default">Close</button>
                                &nbsp;
                                <button type="button" className="btn btn-primary" onClick={this._onSave}>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
		)
	}
})