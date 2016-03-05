var history = ReactRouter.hashHistory;

module.exports = React.createClass({
    propTypes: {
        onAddNewForm: React.PropTypes.func
    },
    render: function(){
        return (
            <div className="page-bar">
                <ul className="page-breadcrumb">
                    <li>
                        <a>E-Form Template List</a>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
                        <button type="button" className="btn green btn-sm" onClick={this.props.onAddNewForm}>
                            <i className="fa fa-plus"></i>&nbsp;
                            Add New E-Form Template
                        </button>
                    </div>
                </div>
            </div>
        )
    }
})