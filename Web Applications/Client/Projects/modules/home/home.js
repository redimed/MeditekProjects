var app = angular.module('app.authentication.home', [
	'app.authentication.home.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	// $urlRouterProvider.otherwise('/home');
	$stateProvider
		.state('authentication.home', {
			abstract: true,
			templateUrl: 'modules/home/views/home.html',
			controller: 'homeCtrl',
			data: {pageTitle: 'Home'},
		})
		.state('authentication.home.list', {
			url: '/home',
			templateUrl: 'modules/home/views/homeList.html',
			controller: 'homeListCtrl',
			data: {pageTitle: 'Home List'},
		})
		.state('authentication.home.list.detail', {
			url: '/detail',
			templateUrl: 'modules/home/views/homeListDetail.html',
			controller: 'homeListDetailCtrl'
		})
		;
});