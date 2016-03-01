var App = require('modules/main');

var routes = {
	path: '/',
	component: App,
	childRoutes: []
}

//var LoggedIn = require('modules/loggedIn/routes');
//routes.childRoutes.push(LoggedIn);
var EForm = require('modules/eform/routes');
EForm.map(function(route){
	routes.childRoutes.push(route);
})

module.exports = routes;