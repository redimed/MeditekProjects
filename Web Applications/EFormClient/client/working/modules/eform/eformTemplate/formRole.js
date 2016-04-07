var EFormService = require('modules/eform/services');
var CommonCheckbox = require('common/checkbox');

module.exports = React.createClass({
    propTypes: {
        onSave: React.PropTypes.func
    },
    roles: [],
    item: null,
    init: function(l){
        var self = this;
        l.Roles.map(function(role){
            self.refs['view_'+role.RoleCode].setValue(role.RelEFormTemplateRole.View);
            self.refs['edit_'+role.RoleCode].setValue(role.RelEFormTemplateRole.Edit);
            self.refs['print_'+role.RoleCode].setValue(role.RelEFormTemplateRole.Print);
        })
        this.item = l;
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
        var Permission = [];
        var self = this;

        this.roles.map(function(role, index){
            var view = (self.refs['view_'+role.RoleCode].getValueTable() === 'yes')?'Y':'N';
            var edit = (self.refs['edit_'+role.RoleCode].getValueTable() === 'yes')?'Y':'N';
            var print = (self.refs['print_'+role.RoleCode].getValueTable() === 'yes')?'Y':'N';

            Permission.push({
                RoleID: role.ID,
                View: view,
                Edit: edit,
                Print: print,
                EFormTemplateID: self.item.ID
            })
        })
        
        EFormService.saveEFormTemplateRole({data: Permission})
        .then(function(){
            self.props.onSave('success')
        })
    },
    render: function(){
        return (
            <div className="form-body">
                <div className="form-group">
                    <label>View</label>
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
                    <label>Edit</label>
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
                <div className="form-group">
                    <label>Print</label>
                    <div className="icheck-inline">
                    {
                        this.roles.map(function(role, index){
                            return (
                                <label key={index}>
                                    <CommonCheckbox ref={'print_'+role.RoleCode}/>
                                    &nbsp;
                                    {role.RoleCode}
                                </label>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="form-group" style={{float:'right'}}>
                    <button type="button" className="btn btn-primary" onClick={this._onSave}>Save</button>
                </div>
            </div>
        )
    }
})