var app = angular.module('app.authentication.study', [
	'app.authentication.study.service',
	'app.authentication.study.directive',
	'app.authentication.study.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.study', {
			abstract: true,
			url: '/study',
			data: {pageTitle: 'Study'},
			templateUrl: 'modules/study/views/study.html',
			controller: 'studyCtrl',
			
		})
		.state('authentication.study.list', {
			url: '/list',
			data: {pageTitle: 'Study List'},
			templateUrl: 'modules/study/views/studyList.html',
			controller: 'studyListCtrl',
		})
		.state('authentication.study.detail', {
			url: '/detail',
			data: {pageTitle: 'Study Detail'},
			templateUrl: 'modules/study/views/studyDetail.html',
			controller: 'studyDetailCtrl',
		})
		;
});