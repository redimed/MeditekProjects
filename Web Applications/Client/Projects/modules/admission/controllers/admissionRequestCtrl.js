var app = angular.module('app.authentication.admission.request.controller',[
	'app.authentication.admission.request.step1.controller',
	'app.authentication.admission.request.step2.controller',
	'app.authentication.admission.request.step3.controller',
]);
app.controller('admissionRequestCtrl',function($scope, $state){
	$scope.admissionRequest = {
		step1: {
			PREVIOUS_SURGERY_PROCEDURES: [],
			MEDICATIONS: [],
		},
		step2: {},
		step3: {},
	};
	$state.go('authentication.admission.request.step1');
});