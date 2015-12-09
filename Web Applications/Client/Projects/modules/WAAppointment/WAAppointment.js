var app = angular.module('app.authentication.WAAppointment', [
	'app.authentication.WAAppointment.controller',
	'app.authentication.WAAppointment.services'
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.WAAppointment', {
			abstract: true,
			url: '/WAAppointment',
			data: {title: 'WAAppointment', pageTitle: 'Telehealth Appointment'},
			templateUrl: 'modules/WAAppointment/views/WAAppointment.html',
			controller: 'WAAppointmentCtrl',
		})
		.state('authentication.WAAppointment.list', {
			url: '/list',
			data: {title: 'WAAppointment', pageTitle: 'Telehealth Appointment'},
			templateUrl: 'modules/WAAppointment/views/WAAppointmentList.html',
			controller: 'WAAppointmentListCtrl',
			resolve: {
				function(){
					$('.input-daterange').datepicker({});
				},
			},
		})
		.state('authentication.WAAppointment.list.detail', {
			url: '/detail',
			data: {title: 'WAAppointment Detail', pageTitle: 'Telehealth Appointment Detail'},
			templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
			controller: 'WAAppointmentListDetailCtrl',
		})
		.state('authentication.WAAppointment.GP', {
			url: '/request',
			data: {title: 'WAAppointment Send Request', pageTitle: 'Telehealth Appointment Send Request'},
			templateUrl: 'modules/WAAppointment/views/WAAppointmentGP.html',
			controller: 'WAAppointmentGPCtrl',
		})
		;
});