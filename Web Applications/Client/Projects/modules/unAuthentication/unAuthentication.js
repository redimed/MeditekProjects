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
		// Doctor
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
					controller: 'activationCtrl'
				}
			}
		})
		.state('unAuthentication.forgot', {
			url: '/forgot',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/forgot.html',
					controller: 'forgotCtrl',
				}
			}
		})
		.state('unAuthentication.changepass', {
			url: '/changepass/:uid/:token',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/changepass.html',
					controller: 'changepassCtrl'
				}
			}
		})
		// ======================================================================
		// patient
		.state('unAuthentication.loginPatient', {
			url: '/loginPatient',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/loginPatient.html',
					controller: 'loginPatientCtrl'
				}
			}
		})
		.state('unAuthentication.registerPatient', {
			url: '/registerPatient',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/registerPatient.html',
					controller: 'registerPatientCtrl'
				}
			}
		})
		.state('unAuthentication.searchPatient', {
			url: '/searchPatient',
			views: {
				'main-content': {
					templateUrl: 'modules/unAuthentication/views/searchPatient.html',
					controller: 'searchPatientCtrl'
				}
			}
		})
		;
});