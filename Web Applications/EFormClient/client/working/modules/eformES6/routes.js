import Main from 'modules/eform/main'
import MainDetail from 'modules/eform/mainDetail'

const routes = [
	{path: '/eform', component: Main},
	{path: '/eform/detail/:formId', component: MainDetail}
]

export default routes