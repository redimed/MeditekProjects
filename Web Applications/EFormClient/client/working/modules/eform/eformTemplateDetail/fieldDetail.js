var CommonInputText = require('common/inputText');
var Markdown = require('common/markdown');
var Config = require('config');

module.exports = React.createClass({
    code: 0,
    ref: '',
    type: '',
    propTypes: {
        onSave: React.PropTypes.func,
        onCloseModal: React.PropTypes.func
    },
    init: function(object){
        this.type = object.type;
        this.ref = object.ref;
        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            if(typeof object.name !== 'undefined')
                this.refs.formName.setValue(object.name);
            this.refs.formPrecal.setValue(object.preCal);
            if(Config.getPrefixField(this.type, 'textarea') > -1){
                this.refs.formRows.setValue(object.rows);
            }
            if(Config.getPrefixField(this.type, 'check') > -1){
                this.refs.formLabel.setValue(object.label);
            }
            if(Config.getPrefixField(this.type, 'radio') > -1){
                this.refs.formValue.setValue(object.value);
            }
            if(Config.getPrefixField(this.type, 'html') > -1){
                this.refs.formEditorLabel.setValue(object.value);
            }
            this.forceUpdate();
        }else if(this.type === 'table'){
             this.refs.formName.setValue(object.name);
             this.forceUpdate();
        }
        this.refs.formSize.setValue(object.size)
        this.code = object.code;
    },
    _onSave: function(){
        var size = this.refs.formSize.getValue();
        var data = null;
        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            data = {
                name: this.refs.formName.getValue(),
                code: this.code,
                type: this.type,
                size: size,
                preCal: this.refs.formPrecal.getValue()
            }
            if(Config.getPrefixField(this.type, 'textarea') > -1)
                data.rows = this.refs.formRows.getValue();
            if(Config.getPrefixField(this.type, 'check') > -1)
                data.label = this.refs.formLabel.getValue();
            if(Config.getPrefixField(this.type, 'radio') > -1)
                data.value = this.refs.formValue.getValue();
            if(Config.getPrefixField(this.type, 'label') > -1){
                delete data.name;
                delete data.preCal;
            }
            if(Config.getPrefixField(this.type, 'html') > -1){
                data.label = this.refs.formEditorLabel.getValue();
            }
        }else if(this.type === 'table'){
            data = {
                name: this.refs.formName.getValue(),
                code: this.code,
                type: 'table',
                size: size
            }
        }
        this.props.onSave(data);
    },
    render: function(){
        var display_name = 'none';
        var display_labelh = 'none';
        var display_value = 'none';
        var display_label = 'none';
        var display_rows = 'none';
        var display_precal = 'block';

        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            display_name = 'block';
            if(Config.getPrefixField(this.type, 'textarea') > -1)
                display_rows = 'block';
            if(Config.getPrefixField(this.type, 'check') > -1)
                display_label = 'block';
            if(Config.getPrefixField(this.type, 'radio') > -1)
                display_value = 'block';
            if(Config.getPrefixField(this.type, 'label') > -1){
                display_name = 'none';
                display_precal = 'none';
            }
            if(Config.getPrefixField(this.type, 'html') > -1){
                display_label = 'none';
                display_labelh = 'block';
            }

        }else if(this.type === 'table'){
            display_name = 'block';
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
                            <div className="form-group" style={{display: display_precal}}>
                                <label>Pre Cal</label>
                                <CommonInputText placeholder="Type Pre Cal" ref="formPrecal"/>
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
                            <div className="form-group" style={{display: display_rows}}>
                                <label>Rows</label>
                                <CommonInputText placeholder="Type value" ref="formRows"/>
                            </div>
                            <div className="form-group">
                                <label>Size</label>
                                <CommonInputText placeholder="Type size" ref="formSize"/>
                            </div>
                            <div className="form-group" style={{float:'right'}}>
                                <button type="button" className="btn btn-default" onClick={this.props.onCloseModal}>Close</button>
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