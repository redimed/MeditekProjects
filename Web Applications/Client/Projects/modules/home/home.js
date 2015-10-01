var app = angular.module('app.loggedIn.home',[
	'app.loggedIn.home.controller'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('loggedIn.home', {
			url: '/home',
			templateUrl: 'modules/home/views/homeView.html'
			//controller: 'homeCtrl'
		});
});