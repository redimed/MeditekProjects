import LoggedIn from 'modules/loggedIn/main'

const routes = {
	path: 'loggedIn',
	component: LoggedIn,
	childRoutes: []
}

import EForm from 'modules/eform/routes'
EForm.map((item)=>{
	routes.childRoutes.push(item)
})

export default routes