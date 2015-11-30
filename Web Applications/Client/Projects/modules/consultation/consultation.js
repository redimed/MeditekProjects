var app = angular.module('app.authentication.consultation',[
	'app.authentication.consultation.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.consultation',{
			abstract: true,
			url: '/consultation',
			data: {pageTitle: 'Consultation'},
			templateUrl: 'modules/consultation/views/consultation.html',
			controller: 'consultationCtrl',
		})
		.state('authentication.consultation.list',{
			url: '/list',
			data: {pageTitle: 'Consultation List'},
			templateUrl: 'modules/consultation/views/consultationList.html',
			controller: 'consultationListCtrl',
		})
		.state('authentication.consultation.detail',{
			url: '/detail',
			data: {pageTitle: 'Consultation Detail'},
			templateUrl: 'modules/consultation/views/consultationDetail.html',
			controller: 'consultationDetailCtrl',
		})
		;
});