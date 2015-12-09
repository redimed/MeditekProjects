var app = angular.module('app.authentication.home', [
	'app.authentication.home.services',
	'app.authentication.home.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.home', {
			abstract: true,
			url: '/home',
			templateUrl: 'modules/home/views/home.html',
			controller: 'homeCtrl',
			data: {pageTitle: 'Home'},
		})
		.state('authentication.home.list', {
			url: '/list',
			templateUrl: 'modules/home/views/homeList.html',
			controller: 'homeListCtrl',
			data: {pageTitle: 'Home List'},
		})
		.state('authentication.home.detail', {
			url: '/detail',
			templateUrl: 'modules/home/views/homeListDetail.html',
			controller: 'homeDetailCtrl',
			data: {pageTitle: 'Home Detail'},
		})

		;
});