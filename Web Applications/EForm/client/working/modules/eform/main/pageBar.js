var history = ReactRouter.hashHistory;

module.exports = React.createClass({
    propTypes: {
        onAddNewForm: React.PropTypes.func
    },
    _goToHome: function(){
        history.push('/eformDev');
    },
    render: function(){
        return (
            <div className="page-bar">
                <ul className="page-breadcrumb">
                    <li>
                        <a onClick={this._goToHome}>Home</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>E-Form Dev</span>
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