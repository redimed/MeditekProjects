class Notification extends React.Component{
	render(){
		return (
			<li className="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">
				<a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className="icon-bell"></i>
                    <span className="badge badge-default"> 2 </span>
                </a>
                <ul className="dropdown-menu">
                	<li className="external">
                		<h3><span className="bold">12 pending</span> notifications</h3>
                		<a>view all</a>
                	</li>
                	<li>
                		<ul className="dropdown-menu-list scroller" style={{height: '250px'}} data-handle-color="#637283">
                			<li>
                				<a>
                					<span className="time">just now</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-success">
                                            <i className="fa fa-plus"></i>
                                        </span> New user registered.
                                    </span>
                				</a>
                			</li>
                			<li>
                				<a>
                					<span className="time">3 mins</span>
                                    <span className="details">
                                        <span className="label label-sm label-icon label-danger">
                                            <i className="fa fa-bolt"></i>
                                        </span> Server overloaded
                                    </span>
                				</a>
                			</li>
                		</ul>
                	</li>
                </ul>
			</li>
		)
	}
}

export default Notification