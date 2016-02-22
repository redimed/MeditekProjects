var app = angular.module('app.authentication.company',[
	'app.authentication.company.controller',
	'app.authentication.company.directive',
	// 'app.authentication.company.services',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.company',{
			url: '/company',
			data: {pageTitle: 'Company'},
			templateUrl: 'modules/company/views/company.html',
			controller: 'companyCtrl',
		})
		.state('authentication.company.home',{
			url: '/home',
			data: {pageTitle: 'Company home'},
			templateUrl: 'modules/company/views/companyHome.html',
			controller: 'companyHomeCtrl',
		})
		.state('authentication.company.list',{
			url: '/list',
			data: {pageTitle: 'Company list'},
			templateUrl: 'modules/company/views/companyList.html',
			controller: 'companyListCtrl',
		})
		.state('authentication.company.detail',{
			url: '/detail',
			data: {pageTitle: 'Company detail'},
			templateUrl: 'modules/company/views/companyDetail.html',
			controller: 'companyDetailCtrl',
		})
		.state('authentication.company.create',{
			url: '/create',
			data: {pageTitle: 'Company create'},
			templateUrl: 'modules/company/views/companyCreate.html',
			controller: 'companyCreateCtrl',
		})
		;
});