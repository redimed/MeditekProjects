var app = angular.module('app.authentication.eFormDev',[
	'app.authentication.eFormDev.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.eFormDev',{
			url: '/eFormDev',
			abstract: true,
			templateUrl: 'modules/eFormDev/views/eFormDev.html',
			controller: 'eFormDevCtrl',
		})
		.state('authentication.eFormDev.home',{
			url: '/home',
			data: {pageTitle: 'E-Forms Home'},
			templateUrl: 'modules/eFormDev/views/eFormDevHome.html',
			controller: 'eFormDevHomeCtrl',
		})
		;
});