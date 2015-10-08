var app = angular.module('app.unAuthentication', [
	'app.unAuthentication.controller',
	//'app.unAuthentication.login.controller'
]);

app.config(function($stateProvider,$urlRouterProvider){
	// $urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('unAuthentication', {
			abstract: true,
			views: {
				'root': {
					templateUrl: 'modules/unAuthentication/views/unAuthentication.html',
					controller: 'unAuthenticationCtrl'
				}
			}
		})
		.state('unAuthentication.login', {
			url: '/login',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/login.html',
					controller: 'loginCtrl'
				}
			}
		})
		.state('unAuthentication.register', {
			url: '/register',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/register.html',

				}
			}
		});
});