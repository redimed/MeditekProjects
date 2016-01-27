var app = angular.module('app.authentication.eForms',[
	'app.authentication.eForms.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.eForms',{
			url: '/eForms',
			data: {pageTitle: 'E-Forms'},
			templateUrl: 'modules/eForms/views/eForms.html',
			controller: 'eFormsCtrl',
		})
		.state('authentication.eForms.home',{
			url: '/home',
			data: {pageTitle: 'E-Forms'},
			templateUrl: 'modules/eForms/views/eFormsHome.html',
			controller: 'eFormsHomeCtrl',
		})
		.state('authentication.eForms.list',{
			url: '/list',
			data: {pageTitle: 'E-Forms'},
			templateUrl: 'modules/eForms/views/eFormsList.html',
			controller: 'eFormsListCtrl',
		})
		.state('authentication.eForms.create',{
			url: '/create',
			data: {pageTitle: 'E-Forms Create'},
			templateUrl: 'modules/eForms/views/eFormsCreate.html',
			controller: 'eFormsCreateCtrl',
		})
		.state('authentication.eForms.appointment',{
			url: '/appointment/:UID/:UIDPatient',
			data: {pageTitle: 'E-Forms Appointment'},
			templateUrl: 'modules/eForms/views/eFormsAppointment.html',
			controller: 'eFormsAppoitmentCtrl',
		})
		;
});