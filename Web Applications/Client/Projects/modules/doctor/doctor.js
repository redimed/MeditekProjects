var app = angular.module('app.authentication.doctor',[
	'app.authentication.doctor.controller'
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.doctor', {
			abstract: true,
			url: '/doctor',
			templateUrl: 'modules/doctor/views/doctor.html',
			controller: 'doctorCtrl'
		})
		.state('authentication.doctor.list', {
			url:'/list',
			data: {pageTitle: 'Doctor List'},
			templateUrl: 'modules/doctor/views/doctorList.html',
			controller: 'doctorListCtrl'
		})
		.state('authentication.doctor.create', {
			url: '/create',
			templateUrl: 'modules/doctor/views/doctorCreate.html',
			controller: 'doctorCreateCtrl'
		})
		.state('authentication.doctor.profile', {
			url: '/profile',
			templateUrl: 'modules/doctor/views/doctorProfile.html',
			controller: 'doctorProfileCtrl'
		});
});