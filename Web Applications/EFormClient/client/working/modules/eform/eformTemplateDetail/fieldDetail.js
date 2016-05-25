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
    formSize:null,
    formSizeSelection:null,
    propTypes: {
        onSave: React.PropTypes.func,
        onCloseModal: React.PropTypes.func
    },
    _initExtend: function(object){
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
            this.refs.formCal.setValue(object.cal);
            switch (this.type) {
                case 'eform_input_text':
                    this.refs.formLabelPrefix.setValue(object.labelPrefix);
                    this.refs.formLabelSuffix.setValue(object.labelSuffix);
                    break;
                case 'eform_input_textarea':
                    this.refs.formRows.setValue(object.rows);
                    break;
                case 'eform_input_check_checkbox':
                case 'eform_input_check_radio':
                    this.refs.formLabel.setValue(object.label);
                    this.refs.formValue.setValue(object.value);
                    break;
                case 'eform_input_check_label':
                    this.refs.formLabel.setValue(object.label);
                    this.refs.formValue.setValue(object.value);
                    break;
                case 'eform_input_check_label_html':
                    this.refs.formEditorLabel.setValue(object.value);
                    break;
                case 'eform_input_signature':
                    this.refs.formHeight.setValue(object.height);
                    break;
            }
        } else if (Config.getPrefixField(this.type, 'button') > -1) {
            if(typeof object.name !== 'undefined'){
                this.refs.formName.setValue(object.name);
            }
            this.refs.formPrecal.setValue(object.preCal);
            this.refs.formCal.setValue(object.cal);
        } else if (this.type === 'table'){
            this.refs.formName.setValue(object.name);
        }

        this.refs.formRef.setValue(object.ref);
        this.code = object.code;

    },
    init: function(object){
        EFormService.getAllUserRoles()
        .then(function(response){
            this.roles = response.data;
            this.type = object.type;
            this.formSize=object.size;
            this.formSizeSelection=[];
            for (var i = 1; i <= 12; i++)
            {
                var size =(
                    <input key={i} type="button" className={"btn btn-default eform-btn-toolbar-size " + (this.formSize==i?'active':'')} value={i}  onClick={this._onClickSetFormSize}/>
                )
                /*<input type="radio" className="btn btn-default" value={i}  onClick={this._onClickSetFormSize}/>*/
                this.formSizeSelection.push(size);
                if(i==6)
                    this.formSizeSelection.push(<br key = "13"/>);
            }

            this.ref = object.ref;
            this.forceUpdate();
            this._initExtend(object);

        }.bind(this))
    },
    componentDidMount: function(){

    },
    _onSave: function(){
        var size = this.formSize;
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
                cal: this.refs.formCal.getValue(),
                roles: Permission,
                ref: this.refs.formRef.getValue()
            }
            switch (this.type) {
                case 'eform_input_text':
                    data.labelPrefix = this.refs.formLabelPrefix.getValue();
                    data.labelSuffix = this.refs.formLabelSuffix.getValue();
                    break;
                case 'eform_input_textarea':
                    data.rows = this.refs.formRows.getValue();
                    break;
                case 'eform_input_check_checkbox':
                case 'eform_input_check_radio':
                    data.label = this.refs.formLabel.getValue();
                    data.value = this.refs.formValue.getValue();
                    break;
                case 'eform_input_check_label':
                    data.label = this.refs.formLabel.getValue();
                    data.value = this.refs.formValue.getValue();
                    delete data.name;
                    delete data.preCal;
                    break;
                case 'eform_input_check_label_html':
                    data.label = this.refs.formLabel.getValue();
                    data.value = this.refs.formValue.getValue();
                    delete data.name;
                    delete data.preCal;
                    data.label = this.refs.formEditorLabel.getValue();
                    break;
                case 'eform_input_signature':
                    data.height = this.refs.formHeight.getValue();
                    break;
            }
        } else if (Config.getPrefixField(this.type, 'button') > -1) {
            data = {
                name: this.refs.formName.getValue(),
                code: this.code,
                type: this.type,
                size: size,
                preCal: this.refs.formPrecal.getValue(),
                cal: this.refs.formCal.getValue(),
                roles: Permission,
                ref: this.refs.formRef.getValue()
            }
        } else if(this.type === 'table'){
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

    _onClickSetFormSize: function(item){
        this.formSize = item.target.value;
        $(item.target).addClass("active").siblings().removeClass("active");
    },

    render: function(){
        var display_name = 'none';
        var display_labelh = 'none';
        var display_value = 'none';
        var display_label = 'none';
        var display_rows = 'none';
        var display_label_prefix = 'none';
        var display_label_suffix = 'none';
        var display_height = 'none';
        var display_precal = 'block';
        var display_role = 'block';

        if(Config.getPrefixField(this.type, 'eform_input') > -1){
            display_name = 'block';
            switch (this.type) {
                case 'eform_input_text':
                    display_label_prefix = 'block';
                    display_label_suffix = 'block';
                    break;
                case 'eform_input_textarea':
                    display_rows = 'block';
                    break;
                case 'eform_input_check_checkbox':
                case 'eform_input_check_radio':
                    display_label = 'block';
                    display_value = 'block';
                    break;
                case 'eform_input_check_label':
                    display_label = 'block';
                    display_value = 'block';
                    display_name = 'none';
                    display_precal = 'none';
                    display_role = 'none';
                    break;
                case 'eform_input_check_label_html':
                    display_labelh = 'block';
                    display_value = 'block';
                    display_label = 'none';
                    display_name = 'none';
                    display_precal = 'none';
                    display_role = 'none';
                    break;
                case 'eform_input_signature':
                    display_height = 'block';
                    break;
            }
        } else if (Config.getPrefixField(this.type, 'button') > -1) {
            display_name = 'block';
            display_precal = 'none';
        } else if (this.type === 'table'){
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
                            <div className="form-group" style={{display: display_precal}}>
                                <label>Calculation</label>
                                <CommonInputText placeholder="Type Calculation" ref="formCal"/>
                            </div>
                            <div className="form-group" style={{display: display_label}}>
                                <label>Label</label>
                                <CommonInputText placeholder="Type label" ref="formLabel"/>
                            </div>
                            <div className="form-group" style={{display: display_label_prefix}}>
                                <label>Label Prefix</label>
                                <CommonInputText placeholder="Type label" ref="formLabelPrefix"/>
                            </div>
                            <div className="form-group" style={{display: display_label_suffix}}>
                                <label>Label Suffix</label>
                                <CommonInputText placeholder="Type label" ref="formLabelSuffix"/>
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
                                {/*<CommonInputText placeholder="Type size" ref="formSize"/>*/}
                                {/*<div className="form-inline">
                                    {this.formSizeSelection}
                                </div>*/}
                                <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                    <div className="btn-group" role="group" aria-label="First group">
                                        {this.formSizeSelection}
                                    </div>
                                </div>
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
                                <div className = "row">
                                    {
                                        this.roles.map(function(role, index){
                                            return (
                                                <div key={index} className ="col-lg-6 col-md-12 eform-font-sm eform-word-wrap">
                                                    <label >
                                                        <CommonCheckbox ref={'view_'+role.RoleCode}/>
                                                        &nbsp;
                                                        {role.RoleCode.length>9? (role.RoleCode.substring(0,9)+'...'):role.RoleCode}
                                                    </label>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                                {/*<div className="icheck-inline">
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
                                </div>*/}
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
                                <div className = "row">
                                    {
                                        this.roles.map(function(role, index){
                                            return (
                                                <div key={index} className = "col-lg-6 col-md-12 eform-font-sm eform-word-wrap">
                                                    <label >
                                                        <CommonCheckbox ref={'edit_'+role.RoleCode}/>
                                                        &nbsp;
                                                        {role.RoleCode.length>9? (role.RoleCode.substring(0,9)+'...'):role.RoleCode}
                                                    </label>
                                                </div>

                                            )
                                        })
                                    }

                                </div>
                                {/*<div className="icheck-inline">
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
                                </div>*/}
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
