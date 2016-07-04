var app = angular.module('app.authentication', [
	'app.authentication.service',
	'app.authentication.controller',
	'app.authentication.home',
	'app.authentication.study',
	'app.authentication.appointment',
	'app.authentication.urgentCare',
	'app.authentication.doctor',
	'app.authentication.patient',
	'app.authentication.user',
	'app.authentication.WAAppointment',
	'app.authentication.consultation',
	'app.authentication.eForm',
	'app.authentication.eFormDev',
	'app.authentication.sandbox',
	'app.authentication.admission',
	'app.authentication.roster',
	'app.authentication.booking',
	'app.authentication.company',
	'app.authentication.onsite',
	'app.authentication.doctorCalling',
	'app.authentication.notification',
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
