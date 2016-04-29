angular.module('app.authentication.doctor',[
	'app.authentication.doctor.service',
	'app.authentication.doctor.controller',
	'app.authentication.doctor.directive.list',
	'app.authentication.doctor.directive.create',
	'app.authentication.doctor.directive.detail'
])

.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.doctor', {
			abstract: true,
			url: '/doctor',
			data: {title: 'Doctor', pageTitle: 'Doctor'},
			templateUrl: 'modules/doctor/views/doctor.html',
			controller: 'doctorCtrl'
		})
		.state('authentication.doctor.home', {
			url:'/home',
			data: {title: 'Doctor Home', pageTitle: 'Doctor Home'},
			templateUrl: 'modules/doctor/views/doctorHome.html',
			controller: 'doctorHomeCtrl'
		})
		.state('authentication.doctor.list', {
			url:'/list',
			data: {title: 'Doctor', pageTitle: 'Doctor'},
			templateUrl: 'modules/doctor/views/doctorList.html',
			controller: 'doctorListCtrl'
		})
		.state('authentication.doctor.create', {
			url: '/create',
			data: {title: 'Doctor Create', pageTitle: 'Create New Doctor'},
			templateUrl: 'modules/doctor/views/doctorCreate.html',
			controller: 'doctorCreateCtrl'
		})
		.state('authentication.doctor.profile', {
			url: '/profile',
			data: {title: 'Doctor Profile', pageTitle: 'Doctor Profile'},
			templateUrl: 'modules/doctor/views/doctorProfile.html',
			controller: 'doctorProfileCtrl'
		})
		.state('authentication.doctor.group', {
			url:'/group',
			data: {title: 'Doctor Group', pageTitle: 'Doctor Group'},
			templateUrl: 'modules/doctor/views/doctorGroup.html',
			controller: 'doctorGroupCtrl'
		})
		.state('authentication.doctor.groupDetail', {
			url:'/group/detail',
			data: {title: 'Doctor Group Detail', pageTitle: 'Doctor Group Detail'},
			templateUrl: 'modules/doctor/views/doctorGroupDetail.html',
			controller: 'doctorGroupDetailCtrl'
		})
		;
})