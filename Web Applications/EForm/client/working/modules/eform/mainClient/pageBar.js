module.exports = React.createClass({
    propTypes: {
        onSelectForm: React.PropTypes.func
    },
    render: function(){
        return (
            <div className="page-bar">
                <ul className="page-breadcrumb">
                    <li>
                        <a>Home</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>E-Form</span>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
                        <button type="button" className="btn green btn-sm" onClick={this.props.onSelectForm}>
                            <i className="fa fa-plus"></i>&nbsp;
                            Select New Form
                        </button>
                    </div>
                </div>
            </div>
        )
    }
})