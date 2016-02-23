class Pagebar extends React.Component{
	render(){
		return (
			<div className="page-bar">
				<ul className="page-breadcrumb">
                    <li>
                        <a>Dashboard</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>E-Form</span>
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
}

Pagebar.propTypes = {
	onAddNewForm: React.PropTypes.func.isRequired
}

export default Pagebar