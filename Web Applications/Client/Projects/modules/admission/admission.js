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

		// request
		.state('authentication.admission.request',{
			data: {title: 'Admission Requests', pageTitle: 'Admission Requests'},
			url: '/request',
			templateUrl: 'modules/admission/views/admissionRequest.html',
			controller: 'admissionRequestCtrl',
		})
		.state('authentication.admission.request.step1',{
			url: '/step1',
			data: {step: 1, title: 'Admission Request step1', pageTitle: 'Admission Request step1'},
			templateUrl: 'modules/admission/views/admissionRequestStep1.html',
			controller: 'admissionRequestStep1Ctrl',
		})
		.state('authentication.admission.request.step2',{
			url: '/step2',
			data: {step: 2, title: 'Admission Request step2', pageTitle: 'Admission Request step2'},
			templateUrl: 'modules/admission/views/admissionRequestStep2.html',
			controller: 'admissionRequestStep2Ctrl',
		})
		.state('authentication.admission.request.step3',{
			url: '/step3',
			data: {step: 3, title: 'Admission Request step3', pageTitle: 'Admission Request step3'},
			templateUrl: 'modules/admission/views/admissionRequestStep3.html',
			controller: 'admissionRequestStep3Ctrl',
		})

		// detail
		.state('authentication.admission.detail',{
			data: {title: 'Admission details', pageTitle: 'Admission details'},
			url: '/detail',
			templateUrl: 'modules/admission/views/admissionDetail.html',
			controller: 'admissionDetailCtrl',
		})
		;
});