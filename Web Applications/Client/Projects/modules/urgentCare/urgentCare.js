var app = angular.module('app.authentication.urgentCare',[
	'app.authentication.urgentCare.controller',
	'app.authentication.urgentCare.services'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.urgentCare', {
			abstract: true,
			url: '/urgentCare',
			data: {title: 'Urgent Care', pageTitle: 'Urgent Care'},
			templateUrl: 'modules/urgentCare/views/urgentCare.html',
			controller: 'urgentCareCtrl',
		})
		.state('authentication.urgentCare.list', {
			url: '/list',
			data: {title: 'Urgent Care', pageTitle: 'Urgent Care'},
			templateUrl: 'modules/urgentCare/views/urgentCareList.html',
			controller: 'urgentCareListCtrl',
		})
		;
});