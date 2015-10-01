var app = angular.module('app.loggedIn.urgentCare',[
	'app.loggedIn.urgentCare.controller'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('loggedIn.urgentCare', {
			url: '/urgentCare',
			templateUrl: 'modules/urgentCare/views/urgentCareView.html',
			controller: 'urgentCareCtrl'
		});
});