var app = angular.module('app.authentication', [
	'app.authentication.controller',
	'app.authentication.home',
	'app.authentication.appointment',
	'app.authentication.doctor',
	'app.authentication.patient',
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
