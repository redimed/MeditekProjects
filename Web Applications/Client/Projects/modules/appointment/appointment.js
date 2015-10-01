var app = angular.module('app.loggedIn.appointment',[
	'app.loggedIn.appointment.controller'
]);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/appointment/list');
	$stateProvider
		.state('loggedIn.appointment', {
			abstract: true,
			//url: 'appointment',
			templateUrl: 'modules/appointment/views/appointment.html',
			controller: 'appointmentCtrl'
		})
		.state('loggedIn.appointment.list', {
			url: '/appointment/list',
			templateUrl: 'modules/appointment/views/appointmentList.html',
			controller: 'appointmentListCtrl'
		})
		.state('loggedIn.appointment.request', {
			url: '/appointment/request',
			templateUrl: 'modules/appointment/views/appointmentRequest.html',
			controller:'appointmentRequestCtrl'
		});
});