var history = ReactRouter.hashHistory;

module.exports = React.createClass({
    propTypes: {
        onAddNewSection: React.PropTypes.func,
        onSaveForm: React.PropTypes.func
    },
    userUID: null,
    name: '',
    setUserUID: function(userUID){
        this.userUID = userUID;
    },
    setName: function(name){
        this.name = name;
    },
    _onAddNewModule: function(){
        this.props.onAddNewModule();
    },
    _onAddNewSection: function(){
        this.props.onAddNewSection();
    },
    _onSaveForm: function(){
        this.props.onSaveForm();
    },
    _goToHome: function(){
        history.push('/eformTemplateModule?userUID='+this.userUID);
    },
    render: function(){
        return (
            <div className="page-bar">
                <ul className="page-breadcrumb">
                    <li>
                        <a onClick={this._goToHome}>EForm Template List</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>{this.name}</span>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
                        <button type="button" className="btn green btn-sm" onClick={this._onAddNewSection}>
                            <i className="fa fa-plus"></i>&nbsp;
                            Add New Section
                         </button>
                        &nbsp;
                        <button type="button" className="btn green btn-sm" onClick={this._onSaveForm}>
                              <i className="fa fa-save"></i>&nbsp;
                              Save Module
                        </button>
                    </div>
                </div>
            </div>
        )
    }
})