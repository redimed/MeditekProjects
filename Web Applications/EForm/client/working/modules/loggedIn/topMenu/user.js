class User extends React.Component{
	render(){
		return (
			<li className="dropdown dropdown-user">
				<a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <img alt="" className="img-circle" src="metronic/assets/layouts/layout/img/avatar1_small.jpg"/>
                    <span className="username username-hide-on-mobile"> Nick </span>
                    <i className="fa fa-angle-down"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-default">
                	<li>
                        <a>
                            <i className="icon-user"></i> My Profile
                        </a>
                    </li>
                    <li>
                        <a>
                            <i className="icon-calendar"></i> My Calendar
                        </a>
                    </li>
                    <li>
                        <a>
                            <i className="icon-envelope-open"></i> My Inbox
                            <span className="badge badge-danger"> 3 </span>
                        </a>
                    </li>
                    <li>
                        <a>
                            <i className="icon-rocket"></i> My Tasks
                            <span className="badge badge-success"> 7 </span>
                        </a>
                    </li>
                    <li className="divider"/>
                    <li>
                        <a>
                            <i className="icon-lock"></i> Lock Screen
                        </a>
                    </li>
                    <li>
                        <a>
                            <i className="icon-key"></i> Log Out
                        </a>
                    </li>
                </ul>
			</li>
		)
	}
}

export default User