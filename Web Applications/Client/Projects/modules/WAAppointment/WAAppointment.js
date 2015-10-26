var app = angular.module('app.authentication.WAAppointment', [
	'app.authentication.WAAppointment.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.WAAppointment', {
			abstract: true,
			url: '/WAAppointment',
			templateUrl: 'modules/WAAppointment/views/WAAppointment.html',
			controller: 'WAAppointmentCtrl',
			data: {pageTitle: 'WAAppointment'},
		})
		.state('authentication.WAAppointment.list', {
			url: '/list',
			templateUrl: 'modules/WAAppointment/views/WAAppointmentList.html',
			controller: 'WAAppointmentListCtrl',
			data: {pageTitle: 'WAAppointment List'},
		})
		.state('authentication.WAAppointment.list.detail', {
			url: '/detail',
			templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
			controller: 'WAAppointmentListDetailCtrl',
		})
		.state('authentication.WAAppointment.GP', {
			url: '/GP',
			data: {pageTitle: 'WAAppointment GP'},
			templateUrl: 'modules/WAAppointment/views/WAAppointmentGP.html',
			controller: 'WAAppointmentGPCtrl',
		})
		;
});