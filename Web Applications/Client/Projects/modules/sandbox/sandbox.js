var app = angular.module('app.authentication.sandbox',[
	'app.authentication.sandbox.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.sandbox',{
			abstract: true,
			data: {title: 'sandbox', pageTitle: 'sandbox'},
			url: '/sandbox',
			templateUrl: 'modules/sandbox/views/sandbox.html',
			controller: 'sandboxCtrl',
		})
		.state('authentication.sandbox.privateForm',{
			data: {title: 'privateForm', pageTitle: 'privateForm'},
			url: '/privateForm',
			templateUrl: 'modules/sandbox/views/privateForm.html',
			controller: 'privateFormCtrl',
		})
		.state('authentication.sandbox.workersComp',{
			data: {title: 'workersComp', pageTitle: 'workersComp'},
			url: '/workersComp',
			templateUrl: 'modules/sandbox/views/workersComp.html',
			controller: 'workersCompCtrl',
		})
		.state('authentication.sandbox.dragTable',{
			data: {title: 'dragTable', pageTitle: 'dragTable'},
			url: '/dragTable',
			templateUrl: 'modules/sandbox/views/dragTable.html',
			controller: 'dragTableCtrl',
		})
		;
});