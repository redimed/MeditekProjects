class Sidebar extends React.Component{
	render(){
		return (
			<div className="page-sidebar-wrapper">
                <div className="page-sidebar navbar-collapse collapse">
                    <ul className="page-sidebar-menu page-header-fixed" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200" style={{paddingTop: '20px'}}>
                        <li className="sidebar-toggler-wrapper hide">
                            <div className="sidebar-toggle"/>
                        </li>
                        <li className="sidebar-search-wrapper">
                            <form className="sidebar-search">
                                <a className="remove">
                                    <i className="icon-close"></i>
                                </a>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search..."/>
                                    <span className="input-group-btn">
                                        <a className="btn submit">
                                            <i className="icon-magnifier"></i>
                                        </a>
                                    </span>
                                </div>
                            </form>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">
                                <i className="icon-home"></i>
                                <span className="title"> Dashboard</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">
                                <i className="icon-puzzle"></i>
                                <span className="title"> E-Form</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
		)
	}
}

export default Sidebar