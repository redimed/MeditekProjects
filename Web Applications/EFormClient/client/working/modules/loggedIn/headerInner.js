import PageLogo from 'modules/loggedIn/pageLogo'
import TopMenu from 'modules/loggedIn/topMenu'

class HeaderInner extends React.Component{
	render(){
		return (
			<div className="page-header-inner">
				<PageLogo/>
				<a className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"/>
				<TopMenu/>
			</div>
		)
	}
}

export default HeaderInner