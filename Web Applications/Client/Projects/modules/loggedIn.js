var app = angular.module('app.loggedIn', [
	'app.loggedIn.controller',
	'app.loggedIn.home',
	'app.loggedIn.urgentCare',
	'app.loggedIn.appointment',
	'app.loggedIn.doctor'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('loggedIn', {
			views: {
				'root': {
					templateUrl: 'common/views/structure.html',
					controller: 'loggedInCtrl'
				}
			}
		});
});