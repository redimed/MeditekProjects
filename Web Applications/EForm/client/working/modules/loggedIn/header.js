import HeaderInner from 'modules/loggedIn/headerInner'

class Header extends React.Component{
	render(){
		return (
			<div className="page-header navbar navbar-fixed-top">
				<HeaderInner/>
			</div>
		)
	}
}

export default Header