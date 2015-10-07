var app = angular.module('app.authentication.appointment', [
	'app.authentication.appointment.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	// $urlRouterProvider.otherwise('/appointment');
	$stateProvider
		.state('authentication.appointment', {
			abstract: true,
			url:'/appointment',
			templateUrl: 'modules/appointment/views/appointment.html',
			controller: 'appointmentCtrl'
		})
		.state('authentication.appointment.list', {
			url: '/list',
			templateUrl: 'modules/appointment/views/appointmentList.html',
			controller: 'appointmentListCtrl'
		})
		.state('authentication.appointment.request', {
			url: '/request',
			templateUrl: 'modules/appointment/views/appointmentRequest.html',
			controller: 'appointmentRequestCtrl'
		});
});