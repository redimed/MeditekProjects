var app = angular.module('app.authentication.admission',[
	'app.authentication.admission.controller',
	'app.authentication.admission.services'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.consultation.detail.admission',{
			abstract: true,
			data: {title: 'Admission', pageTitle: 'Admission'},
			url: '/admission',
			templateUrl: 'modules/admission/views/admission.html',
			controller: 'admissionCtrl',
		})

		.state('authentication.consultation.detail1.admission',{
			abstract: true,
			data: {title: 'Admission', pageTitle: 'Admission'},
			url: '/admission1',
			templateUrl: 'modules/admission/views/admission.html',
			controller: 'admissionCtrl',
		})

		// request
		.state('authentication.consultation.detail.admission.request',{
			data: {title: 'Admission Requests', pageTitle: 'Admission Requests'},
			url: '/request',
			templateUrl: 'modules/admission/views/admissionRequest.html',
			controller: 'admissionRequestCtrl',
		})
		.state('authentication.consultation.detail.admission.request.step1',{
			url: '/step1',
			data: {step: 1, title: 'Admission Request step1', pageTitle: 'Admission Request step1'},
			templateUrl: 'modules/admission/views/admissionRequestStep1.html',
			controller: 'admissionRequestStep1Ctrl',
		})
		.state('authentication.consultation.detail.admission.request.step2',{
			url: '/step2',
			data: {step: 2, title: 'Admission Request step2', pageTitle: 'Admission Request step2'},
			templateUrl: 'modules/admission/views/admissionRequestStep2.html',
			controller: 'admissionRequestStep2Ctrl',
		})
		.state('authentication.consultation.detail.admission.request.step3',{
			url: '/step3',
			data: {step: 3, title: 'Admission Request step3', pageTitle: 'Admission Request step3'},
			templateUrl: 'modules/admission/views/admissionRequestStep3.html',
			controller: 'admissionRequestStep3Ctrl',
		})

		// detail
		.state('authentication.consultation.detail.admission.detail',{
			data: {title: 'Admission details', pageTitle: 'Admission details'},
			url: '/detail',
			templateUrl: 'modules/admission/views/admissionDetail.html',
			controller: 'admissionDetailCtrl',
		})

		.state('authentication.consultation.detail1.admission.detail',{
			data: {title: 'Admission details', pageTitle: 'Admission details'},
			url: '/detail1',
			templateUrl: 'modules/admission/views/admissionDetail.html',
			controller: 'admissionDetailCtrl',
		})
		;
});