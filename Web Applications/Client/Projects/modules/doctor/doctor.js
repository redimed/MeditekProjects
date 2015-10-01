var app = angular.module('app.loggedIn.doctor',[
	'app.loggedIn.doctor.controller',
	'app.loggedIn.doctor.profile.controller'
]);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/doctor/list');
	$stateProvider
		.state('loggedIn.doctor', {
			abstract: true,
			templateUrl: 'modules/doctor/views/doctor.html',
			controller: 'doctorCtrl'
		})
		.state('loggedIn.doctor.list', {
			url:'/doctor/list',
			templateUrl: 'modules/doctor/views/doctorList.html'
		})
		.state('loggedIn.doctor.create', {
			url: '/doctor/create',
			templateUrl: 'modules/doctor/views/doctorCreate.html'
		})
		.state('loggedIn.doctor.profile', {
			url: '/doctor/profile',
			templateUrl: 'modules/doctor/views/doctorProfile.html',
			controller: 'doctorProfileCtrl'
		});
});