var CommonInputText = require('common/inputText');
var CommonDropdown = require('common/dropdown');
var Markdown = require('common/markdown');
var CommonCheckbox = require('common/checkbox');
var Config = require('config');
var EFormService = require('modules/eform/services');

module.exports = React.createClass({
    code: 0,
    roles: [],
    ref: '',
    type: '',
    propTypes: {
        onSave: React.PropTypes.func,
        onCloseModal: React.PropTypes.func
    },
    init: function(object){
        this.type = object.type;
        this.forceUpdate();
        this.ref = object.ref;
        var self = this;

        if(typeof object.roles !== 'undefined'){
            var roles = object.roles.toJS();
            roles.view.list.map(function(role, index){
                var checked = (role.value === 'yes')?true:false;
                self.refs[role.ref].setChecked(checked);
            })
            roles.edit.map(function(role, index){
                var checked = (role.value === 'yes')?true:false;
                self.refs[role.ref].setChecked(checked);
            })
        }

        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            if(typeof object.name !== 'undefined'){
                this.refs.formName.setValue(object.name);
            }
            this.refs.formPrecal.setValue(object.preCal);
            if(Config.getPrefixField(this.type, 'textarea') > -1){
                this.refs.formRows.setValue(object.rows);
            }
            if(Config.getPrefixField(this.type, 'check') > -1){
                this.refs.formLabel.setValue(object.label);
                this.refs.formValue.setValue(object.value);
            }
            if(Config.getPrefixField(this.type, 'html') > -1){
                this.refs.formEditorLabel.setValue(object.value);
            }
            if(Config.getPrefixField(this.type, 'signature') > -1){
                this.refs.formHeight.setValue(object.height);
            }
        }else if(this.type === 'table'){
             this.refs.formName.setValue(object.name);
        }
        this.refs.formSize.setValue(object.size);
        this.refs.formRef.setValue(object.ref);
        this.code = object.code;
    },
    componentDidMount: function(){
        var self = this;
        EFormService.getAllUserRoles()
        .then(function(response){
            self.roles = response.data;
            self.forceUpdate();
        })
    },
    _onSave: function(){
        var size = this.refs.formSize.getValue();
        var data = null;
        var self = this;

        var Permission = {
            view: {option: 'hide', list: []},
            edit: []
        }

        this.roles.map(function(role, index){
            Permission.view.list.push({
                id: role.ID,
                ref: 'view_'+role.RoleCode,
                value: self.refs['view_'+role.RoleCode].getValueTable()
            })
            Permission.edit.push({
                id: role.ID,
                ref: 'edit_'+role.RoleCode,
                value: self.refs['edit_'+role.RoleCode].getValueTable()
            })
        })

        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            data = {
                name: this.refs.formName.getValue(),
                code: this.code,
                type: this.type,
                size: size,
                preCal: this.refs.formPrecal.getValue(),
                roles: Permission,
                ref: this.refs.formRef.getValue()
            }
            if(Config.getPrefixField(this.type, 'textarea') > -1)
                data.rows = this.refs.formRows.getValue();
            if(Config.getPrefixField(this.type, 'check') > -1){
                data.label = this.refs.formLabel.getValue();
                data.value = this.refs.formValue.getValue();
            }
            if(Config.getPrefixField(this.type, 'label') > -1){
                delete data.name;
                delete data.preCal;
            }
            if(Config.getPrefixField(this.type, 'html') > -1){
                data.label = this.refs.formEditorLabel.getValue();
            }
            if(Config.getPrefixField(this.type, 'signature') > -1){
                data.height = this.refs.formHeight.getValue();
            }

        }else if(this.type === 'table'){
            data = {
                name: this.refs.formName.getValue(),
                code: this.code,
                type: 'table',
                size: size,
                roles: Permission,
                ref: this.refs.formRef.getValue()
            }
        }
        this.props.onSave(data);
    },
    _onChangeCheckAllView: function(value){
        var self = this;
        this.roles.map(function(role, index){
            var checked = (value === 'yes')?true:false;
            self.refs['view_'+role.RoleCode].setChecked(checked);
        })
    },
    _onChangeCheckAllEdit: function(value){
        var self = this;
        this.roles.map(function(role, index){
            var checked = (value === 'yes')?true:false;
            self.refs['edit_'+role.RoleCode].setChecked(checked);
        })
    },
    render: function(){
        var display_name = 'none';
        var display_labelh = 'none';
        var display_value = 'none';
        var display_label = 'none';
        var display_rows = 'none';
        var display_precal = 'block';
        var display_height = 'none';
        var display_role = 'block';

        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            display_name = 'block';
            if(Config.getPrefixField(this.type, 'textarea') > -1)
                display_rows = 'block';
            if(Config.getPrefixField(this.type, 'check') > -1){
                display_label = 'block';
                display_value = 'block';
            }
            if(Config.getPrefixField(this.type, 'label') > -1){
                display_name = 'none';
                display_precal = 'none';
                display_role = 'none';
            }
            if(Config.getPrefixField(this.type, 'html') > -1){
                display_label = 'none';
                display_labelh = 'block';
            }
            if(Config.getPrefixField(this.type, 'signature') > -1){
                display_height = 'block';
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
                            <div className="form-group" style={{display: display_height}}>
                                <label>Height</label>
                                <CommonInputText placeholder="Type size" ref="formHeight"/>
                            </div>
                            <div className="form-group">
                                <label>Ref</label>
                                <CommonInputText placeholder="Ref" ref="formRef"/>
                            </div>
                            <div className="form-group">
                                <div className="icheck-inline">
                                    <label>
                                        <CommonCheckbox ref="checkall_view"
                                            onChange={this._onChangeCheckAllView}/>
                                        &nbsp;
                                        Check All View
                                    </label>
                                </div>
                                <div className="icheck-inline">
                                {
                                    this.roles.map(function(role, index){
                                        return (
                                            <label key={index}>
                                                <CommonCheckbox ref={'view_'+role.RoleCode}/>
                                                &nbsp;
                                                {role.RoleCode}
                                            </label>
                                        )
                                    })
                                }
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="icheck-inline">
                                    <label>
                                        <CommonCheckbox ref="checkall_edit"
                                            onChange={this._onChangeCheckAllEdit}/>
                                        &nbsp;
                                        Check All Edit
                                    </label>
                                </div>
                                <div className="icheck-inline">
                                {
                                    this.roles.map(function(role, index){
                                        return (
                                            <label key={index}>
                                                <CommonCheckbox ref={'edit_'+role.RoleCode}/>
                                                &nbsp;
                                                {role.RoleCode}
                                            </label>
                                        )
                                    })
                                }
                                </div>
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