var app = angular.module('app.authentication', [
	'app.authentication.service',
	'app.authentication.controller',
	'app.authentication.home',
	'app.authentication.appointment',
	'app.authentication.doctor',
	'app.authentication.patient',
	'app.authentication.user',
	'app.authentication.userProfile',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication', {
			views: {
				'root': {
					templateUrl: 'modules/authentication/views/authentication.html',
					controller: 'authenticationCtrl'
				}
			}
		});
});
