var app = angular.module('app.unAuthentication', [
	'app.unAuthentication.controller',
	'app.unAuthentication.service'
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
					controller: 'registerCtrl'

				}
			}
		})
		.state('unAuthentication.activation', {
			url: '/activation',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/activation.html',

				}
			}
		})
		.state('unAuthentication.forgot', {
			url: '/forgot',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/forgot.html',

				}
			}
		});
});