import Header from 'modules/loggedIn/header'
import Sidebar from 'modules/loggedIn/sidebar'

class LoggedIn extends React.Component{
	componentWillMount(){
		$('body').addClass('page-header-fixed page-sidebar-closed-hide-logo page-content-white')
	}
	componentWillUnmount(){
		$('body').removeClass('page-header-fixed page-sidebar-closed-hide-logo page-content-white')
	}
	render(){
		return (
			<div>
				<Header ref="header"/>
				<div className="clearfix"/>
				<div className="page-container">
					<Sidebar/>
					<div className="page-content-wrapper">
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}

export default LoggedIn