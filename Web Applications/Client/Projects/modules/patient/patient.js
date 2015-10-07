var app = angular.module('app.authentication.patient', [
	'app.authentication.patient.controller'
]);

app.config(function($stateProvider, $urlRouterProvider){
	// $urlRouterProvider.otherwise('/patient/list');
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
		});
});