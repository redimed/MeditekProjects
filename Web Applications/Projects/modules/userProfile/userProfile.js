var app = angular.module('app.authentication.userProfile', [
	'app.authentication.userProfile.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.userProfile', {
			abstract: true,
			url: '/userProfile',
			data: {pageTitle: 'userProfile'},
			templateUrl: 'modules/userProfile/views/userProfile.html',
			controller: 'userProfileCtrl',
		})
		.state('authentication.userProfile.list', {
			url: '/list',
			data: {pageTitle: 'userProfile List'},
			templateUrl: 'modules/userProfile/views/userProfileList.html',
			controller: 'userProfileListCtrl',
		})
		.state('authentication.userProfile.list.detail', {
			url: '/detail',
			data: {pageTitle: 'userProfile Detail'},
			templateUrl: 'modules/userProfile/views/userProfileListDetail.html',
			controller: 'userProfileListDetailCtrl',
		})
		;
});