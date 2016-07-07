var app = angular.module('app.authentication.roster',[
	'app.authentication.roster.controller',
	'app.authentication.roster.services',
	'app.authentication.roster.directive'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.roster',{
			abstract: true,
			url: '/roster',
			data: {pageTitle: 'Roster Managerment'},
			templateUrl: 'modules/roster/views/roster.html',
			controller: 'rosterCtrl',
		})
		.state('authentication.roster.home',{
			url: '/home',
			data: {pageTitle: 'Roster Managerment Home'},
			templateUrl: 'modules/roster/views/rosterHome.html',
			controller: 'rosterHomeCtrl',
		})
		.state('authentication.roster.calendar',{
			url: '/calendar/:doctorId',
			data: {pageTitle: 'Roster Managerment Calendar'},
			templateUrl: 'modules/roster/views/calendar.html',
			controller: 'calendarCtrl',
		})
		;
});