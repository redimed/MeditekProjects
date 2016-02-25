var CommonInputText = require('common/inputText');
var Markdown = require('common/markdown');

module.exports = React.createClass({
    code: 0,
    ref: '',
    type: '',
    propTypes: {
        onSave: React.PropTypes.func
    },
    init: function(object){
        this.type = object.type;
        this.ref = object.ref;
        if(this.type === 'label' || this.type === 'clh' || this.type === 'rlh'){
            this.refs.formLabel.setValue(object.label);
            if(this.type === 'rlh'){
                this.refs.formName.setValue(object.name);
                this.refs.formValue.setValue(object.value);
            }else if(this.type === 'clh'){
                this.refs.formName.setValue(object.name);
            }
            this.forceUpdate();
        }else if(this.type === 'labelh'){
            this.refs.formEditorLabel.setValue(object.label);
            this.forceUpdate();
        }else{
            this.refs.formName.setValue(object.name);
        }
        this.refs.formSize.setValue(object.size)
        this.code = object.code;
    },
    _onSave: function(){
        var size = this.refs.formSize.getValue();
        var data = null;
        if(this.type !== 'label' && this.type !== 'labelh' && this.type !== 'rlh' && this.type !== 'clh'){
            var name = this.refs.formName.getValue();
            data = {
                label: '', name: name, code: this.code, size: size, type: this.type
            }
        }else{
            if(this.type === 'label')
                var label = this.refs.formLabel.getValue();
            else if(this.type === 'labelh')
                var label = this.refs.formEditorLabel.getValue();
            data = {
                label: label, code: this.code, size: size, type: this.type, name: '', value: '', ref: ''
            }
            if(this.type === 'rlh' || this.type === 'clh'){
                data.name = this.refs.formName.getValue();
                data.label = this.refs.formLabel.getValue();
            }
            if(this.type === 'rlh'){
                data.value = this.refs.formValue.getValue();
                data.ref = this.ref;
            }
        }
        this.props.onSave(data);
    },
	render: function(){
        var display_labelh = '';
        var display_label = '';
        var display_name = '';
        var display_value = 'none';
        if(this.type === 'labelh'){
            display_labelh = 'block';
            display_label = 'none';
            display_name = 'none';
        }else if(this.type === 'label' || this.type === 'clh' || this.type === 'rlh'){
            display_labelh = 'none';
            display_label = 'block';
            display_name = 'none';
        }else{
            display_labelh = 'none';
            display_label = 'none';
            display_name = 'block';
        }

        if(this.type === 'clh' || this.type === 'rlh'){
            display_name = 'block';   
        }
        if(this.type === 'rlh'){
            display_value = 'block';
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group" style={{display: display_labelh}}>
                                <label>Label</label>
                                <Markdown ref="formEditorLabel"/>
                            </div>
                            <div className="form-group" style={{display: display_label}}>
                                <label>Label</label>
                                <CommonInputText placeholder="Type label" ref="formLabel"/>
                            </div>
                            <div className="form-group" style={{display: display_name}}>
                                <label>Name</label>
                                <CommonInputText placeholder="Type name" ref="formName"/>
                            </div>
                            <div className="form-group" style={{display: display_value}}>
                                <label>Value</label>
                                <CommonInputText placeholder="Type value" ref="formValue"/>
                            </div>
                            <div className="form-group">
                                <label>Size</label>
                                <CommonInputText placeholder="Type size" ref="formSize"/>
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