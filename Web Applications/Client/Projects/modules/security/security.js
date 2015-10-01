var app = angular.module('app.security', [
	'app.security.controller',
	'app.security.login.controller'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('security', {
			abstract: false,
			views: {
				'root': {
					templateUrl: 'modules/security/views/securityView.html',
					controller: 'securityCtrl'
				}
			}
		})
		.state('security.login', {
			url: '/login',
			views: {
				'main-content': {
					templateUrl: 'modules/security/views/login.html',
					controller: 'securityLoginCtrl'
				}
			}
		})
		.state('security.createUser', {
			url: '/createUser',
			views: {
				'main-content': {
					templateUrl: 'modules/security/views/createUser.html'
				}
			}
		});
});