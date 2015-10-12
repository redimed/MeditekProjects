var app = angular.module('app.authentication.doctor',[
	'app.authentication.doctor.controller'
]);

app.config(function($stateProvider, $urlRouterProvider){
	// $urlRouterProvider.otherwise('/doctor/list');
	$stateProvider
		.state('authentication.doctor', {
			abstract: true,
			url: '/doctor',
			templateUrl: 'modules/doctor/views/doctor.html',
			controller: 'doctorCtrl'
		})
		.state('authentication.doctor.list', {
			url:'/list',
			templateUrl: 'modules/doctor/views/doctorList.html',
			controller: 'doctorListCtrl'
		})
		.state('authentication.doctor.checkPhone', {
			url: '/checkPhone',
			templateUrl: 'modules/doctor/views/doctorCheckPhone.html'
		})
		.state('authentication.doctor.create', {
			url: '/create',
			templateUrl: 'modules/doctor/views/doctorCreate.html'
		})
		.state('authentication.doctor.profile', {
			url: '/profile',
			templateUrl: 'modules/doctor/views/doctorProfile.html',
			controller: 'doctorProfileCtrl'
		});
});