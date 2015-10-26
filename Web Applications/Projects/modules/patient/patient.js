var app = angular.module('app.authentication.patient', [
	'app.authentication.patient.directive',
	'app.authentication.patient.controller',
	'app.authentication.patient.services'
	
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.patient', {
			abstract: true,
			url: '/patient',
			templateUrl: 'modules/patient/views/patient.html',
			controller: 'patientCtrl'
		})
		.state('authentication.patient.list', {
			url: '/list',
			templateUrl: 'modules/patient/views/patientList.html',
			controller: 'patientListCtrl'
			
		})
		.state('authentication.patient.create', {
			url: '/create',
			templateUrl: 'modules/patient/views/patientCreate.html',
			controller: 'patientCreateCtrl'
		});
});