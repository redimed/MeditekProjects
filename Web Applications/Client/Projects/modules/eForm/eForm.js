var app = angular.module('app.authentication.eForm',[
	'app.authentication.eForm.controller',
	'app.authentication.eForm.directive',
	// 'app.authentication.eForm.services',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.eForm',{
			url: '/eForm',
			data: {pageTitle: 'E-Form'},
			templateUrl: 'modules/eForm/views/eForm.html',
			controller: 'eFormCtrl',
		})
		.state('authentication.eForm.home',{
			url: '/home',
			data: {pageTitle: 'E-Forms Home'},
			templateUrl: 'modules/eForm/views/eFormHome.html',
			controller: 'eFormHomeCtrl',
		})
		.state('authentication.eForm.list',{
			url: '/list',
			data: {pageTitle: 'E-Form List'},
			templateUrl: 'modules/eForm/views/eFormList.html',
			controller: 'eFormListCtrl',
		})
		.state('authentication.eForm.detail',{
			url: '/detail',
			data: {pageTitle: 'E-Forms Detail'},
			templateUrl: 'modules/eForm/views/eFormDetail.html',
			controller: 'eFormDetailCtrl',
		})
		.state('authentication.eForm.create',{
			url: '/create',
			data: {pageTitle: 'E-Form Create'},
			templateUrl: 'modules/eForm/views/eFormCreate.html',
			controller: 'eFormCreateCtrl',
		})
		.state('authentication.eForm.appointment',{
			url: '/appointment',
			data: {pageTitle: 'E-Forms Appointment'},
			templateUrl: 'modules/eForm/views/eFormAppointment.html',
			controller: 'eFormAppointmentCtrl',
		})
		;
});