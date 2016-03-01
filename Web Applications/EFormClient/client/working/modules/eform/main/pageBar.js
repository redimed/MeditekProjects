var history = ReactRouter.hashHistory;

module.exports = React.createClass({
    propTypes: {
        onAddNewForm: React.PropTypes.func
    },
    patientUID: null,
    init: function(patientUID){
        this.patientUID = patientUID;
    },
    _goToHome: function(){
        history.push('/eformDev?patientUID='+this.patientUID);
    },
    render: function(){
        return (
            <div className="page-bar">
                <ul className="page-breadcrumb">
                    <li>
                        <a onClick={this._goToHome}>E-Form Dev List</a>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
                        <button type="button" className="btn green btn-sm" onClick={this.props.onAddNewForm}>
                            <i className="fa fa-plus"></i>&nbsp;
                            Add New E-Form
                        </button>
                    </div>
                </div>
            </div>
        )
    }
})