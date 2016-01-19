var app = angular.module('app.authentication.patient', [
	'app.authentication.patient.directive',
	'app.authentication.patient.controller',
	'app.authentication.patient.services',
	'app.authentication.patient.home.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.patient', {
			abstract: true,
			url: '/patient',
			data: {title: 'Patient', pageTitle: 'Patient'},
			templateUrl: 'modules/patient/views/patient.html',
			controller: 'patientCtrl'
		})
		.state('authentication.patient.home', {
			url: '/home',
			data: {title: 'Patient Home', pageTitle: 'Patient Home'},
			templateUrl: 'modules/patient/views/patientHome.html',
			controller: 'patientHomeCtrl',
		})
		.state('authentication.patient.list', {
			url: '/list',
			data: {title: 'Patient List', pageTitle: 'Patient List'},
			templateUrl: 'modules/patient/views/patientList.html',
			controller: 'patientListCtrl'
		})
		.state('authentication.patient.create', {
			url: '/create',
			data: {title: 'Patient Create', pageTitle: 'Create New Patient'},
			templateUrl: 'modules/patient/views/patientCreate.html',
			controller: 'patientCreateCtrl'
		});
});