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
		.state('authentication.admission.detail.step1',{
			url: '/step1',
			data: {step: 1, title: 'Admission detail step1', pageTitle: 'Admission detail step1'},
			templateUrl: 'modules/admission/views/admissionDetailStep1.html',
			controller: 'admissionDetailStep1Ctrl',
		})
		.state('authentication.admission.detail.step2',{
			url: '/step2',
			data: {step: 2, title: 'Admission detail step2', pageTitle: 'Admission detail step2'},
			templateUrl: 'modules/admission/views/admissionDetailStep2.html',
			controller: 'admissionDetailStep2Ctrl',
		})
		.state('authentication.admission.detail.step3',{
			url: '/step3',
			data: {step: 3, title: 'Admission detail step3', pageTitle: 'Admission detail step3'},
			templateUrl: 'modules/admission/views/admissionDetailStep3.html',
			controller: 'admissionDetailStep3Ctrl',
		})
		;
});