import Nofitication from 'modules/loggedIn/topMenu/notification'
import Inbox from 'modules/loggedIn/topMenu/inbox'
import Todo from 'modules/loggedIn/topMenu/todo'
import User from 'modules/loggedIn/topMenu/user'

class TopMenu extends React.Component{
	render(){
		return (
			<div className="top-menu">
				<ul className="nav navbar-nav pull-right">
					<Nofitication/>
					<Inbox/>
					<Todo/>
					<User/>
				</ul>
			</div>
		)
	}
}

export default TopMenu