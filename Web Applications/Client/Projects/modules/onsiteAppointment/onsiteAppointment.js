var app = angular.module('app.authentication.onsiteAppointment',[
	'app.authentication.onsiteAppointment.controller',
	'app.authentication.onsiteAppointment.directive',
	// 'app.authentication.onsiteAppointment.services',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.onsiteAppointment',{
			url: '/onsiteAppointment',
			data: {pageTitle: 'onsiteAppointment'},
			templateUrl: 'modules/onsiteAppointment/views/onsiteAppointment.html',
			controller: 'onsiteAppointmentCtrl',
		})
		.state('authentication.onsiteAppointment.home',{
			url: '/home',
			data: {pageTitle: 'onsiteAppointment home'},
			templateUrl: 'modules/onsiteAppointment/views/onsiteAppointmentHome.html',
			controller: 'onsiteAppointmentHomeCtrl',
		})
		.state('authentication.onsiteAppointment.list',{
			url: '/list',
			data: {pageTitle: 'onsiteAppointment list'},
			templateUrl: 'modules/onsiteAppointment/views/onsiteAppointmentList.html',
			controller: 'onsiteAppointmentListCtrl',
		})
		.state('authentication.onsiteAppointment.detail',{
			url: '/detail',
			data: {pageTitle: 'onsiteAppointment detail'},
			templateUrl: 'modules/onsiteAppointment/views/onsiteAppointmentDetail.html',
			controller: 'onsiteAppointmentDetailCtrl',
		})
		.state('authentication.onsiteAppointment.create',{
			url: '/create',
			data: {pageTitle: 'onsiteAppointment create'},
			templateUrl: 'modules/onsiteAppointment/views/onsiteAppointmentCreate.html',
			controller: 'onsiteAppointmentCreateCtrl',
		})
		;
});