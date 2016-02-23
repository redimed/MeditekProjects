class Todo extends React.Component{
	render(){
		return (
			<li className="dropdown dropdown-extended dropdown-tasks" id="header_task_bar">
				<a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className="icon-calendar"></i>
                    <span className="badge badge-default"> 2 </span>
                </a>
                <ul className="dropdown-menu">
                	<li className="external">
                		<h3><span className="bold">12 pending</span> tasks</h3>
                		<a>view all</a>
                	</li>
                	<li>
                		<ul className="dropdown-menu-list scroller" style={{height: '275px'}} data-handle-color="#637283">
                			<li>
                				<a>
                                    <span className="task">
                                        <span className="desc">New release v1.2 </span>
                                        <span className="percent">30%</span>
                                    </span>
                                    <span className="progress">
                                        <span style={{width: '40%'}} className="progress-bar progress-bar-success" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                                            <span className="sr-only">40% Complete</span>
                                        </span>
                                    </span>
                				</a>
                			</li>
                			<li>
                				<a>
                                    <span className="task">
                                        <span className="desc">Application Development</span>
                                        <span className="percent">65%</span>
                                    </span>
                                    <span className="progress">
                                        <span style={{width: '65%'}} className="progress-bar progress-bar-danger" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
                                            <span className="sr-only">40% Complete</span>
                                        </span>
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

export default Todo