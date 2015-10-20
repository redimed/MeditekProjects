var app = angular.module('app.authentication.user', [
	'app.authentication.user.controller',
]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('authentication.user', {
			abstract: true,
			url: '/user',
			templateUrl: 'modules/user/views/user.html',
			controller: 'userCtrl'
		})
		.state('authentication.user.list', {
			url: '/list',
			templateUrl: 'modules/user/views/userList.html',
			controller: 'userListCtrl'
		})
		// .state('authentication.user.list.detail', {
		// 	url: '/detail',
		// 	templateUrl: 'modules/user/views/userListDetail.html',
		// 	controller: 'userListDetailCtrl'
		// })
		.state('authentication.user.profile', {
			url: '/profile',
			templateUrl: 'modules/user/views/userProfile.html',
			controller: 'userProfileCtrl'
		})
		;
});