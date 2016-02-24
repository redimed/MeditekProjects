var app = angular.module('app.authentication.onsite',[
	'app.authentication.onsite.controller',
	'app.authentication.onsite.directive',
	// 'app.authentication.onsite.services',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.onsite',{
			url: '/onsite',
			data: {pageTitle: 'Onsite'},
			templateUrl: 'modules/onsite/views/onsite.html',
			controller: 'onsiteCtrl',
		})
		.state('authentication.onsite.home',{
			url: '/home',
			data: {pageTitle: 'Onsite Home'},
			templateUrl: 'modules/onsite/views/onsiteHome.html',
			controller: 'onsiteHomeCtrl',
		})
		.state('authentication.onsite.appointment',{
			url: '/appointment/:UID',
			data: {pageTitle: 'Onsite Appointment'},
			templateUrl: 'modules/onsite/views/onsiteAppointment.html',
			controller: 'onsiteAppointmentCtrl',
		})
		;
});