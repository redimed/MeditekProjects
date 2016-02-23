class Inbox extends React.Component{
	render(){
		return (
			<li className="dropdown dropdown-extended dropdown-inbox" id="header_inbox_bar">
				<a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className="icon-envelope-open"></i>
                    <span className="badge badge-default"> 2 </span>
                </a>
                <ul className="dropdown-menu">
                	<li className="external">
                		<h3><span className="bold">7 new</span> messages</h3>
                		<a>view all</a>
                	</li>
                	<li>
                		<ul className="dropdown-menu-list scroller" style={{height: '250px'}} data-handle-color="#637283">
                			<li>
                				<a>
                                    <span className="photo">
                                        <img src="metronic/assets/layouts/layout/img/avatar2.jpg"
                                            className="img-circle" alt=""/>
                                    </span>
                					<span className="subject">
                                        <span className="from"> Lisa Wong </span>
                                        <span className="time">Just Now </span>
                                    </span>
                                    <span className="message"> Vivamus sed auctor nibh congue nibh. auctor nibh auctor nibh... </span>
                				</a>
                			</li>
                			<li>
                				<a>
                                    <span className="photo">
                                        <img src="metronic/assets/layouts/layout/img/avatar3.jpg"
                                            className="img-circle" alt=""/>
                                    </span>
                                    <span className="subject">
                                        <span className="from"> Richard Doe </span>
                                        <span className="time">46 mins </span>
                                    </span>
                                    <span className="message"> Vivamus sed auctor nibh congue nibh. auctor nibh auctor nibh... </span>
                                </a>
                			</li>
                		</ul>
                	</li>
                </ul>
			</li>
		)
	}
}

export default Inbox