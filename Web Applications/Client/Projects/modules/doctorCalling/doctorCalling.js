var app = angular.module('app.authentication.doctorCalling',[
	'app.authentication.doctorCalling.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.doctorCalling',{
			abstract: true,
			url:'/doctorCalling',
			templateUrl: 'modules/doctorCalling/views/doctorCalling.html',
			controller: 'doctorCallingCtrl',
		})
		.state('authentication.doctorCalling.home',{
			url:'/home',
			templateUrl: 'modules/doctorCalling/views/doctorCallingHome.html',
			controller: 'doctorCallingHomeCtrl',
		})
		.state('authentication.doctorCalling.list',{
			url:'/list',
			templateUrl: 'modules/doctorCalling/views/doctorCallingList.html',
			controller: 'doctorCallingListCtrl',
		})
		;
});