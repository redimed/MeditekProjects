var app = angular.module('app.authentication.admission',[
	'app.authentication.admission.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.admission',{
			abstract: true,
			data: {title: 'Admission', pageTitle: 'Admission'},
			url: '/admission',
			templateUrl: 'modules/admission/views/admission.html',
			controller: 'admissionCtrl',
		})
		.state('authentication.admission.detail',{
			data: {title: 'Admission details', pageTitle: 'Admission details'},
			url: '/detail',
			templateUrl: 'modules/admission/views/admissionDetail.html',
			controller: 'admissionDetailCtrl',
		})
		;
});