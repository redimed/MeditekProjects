var app = angular.module('app.authentication.admission.detail.controller',[
	'app.authentication.admission.detail.step1.controller',
	'app.authentication.admission.detail.step2.controller',
	'app.authentication.admission.detail.step3.controller',
]);
app.controller('admissionDetailCtrl',function($scope, $state){
	$scope.admissionDetail = {
		step1: {
			PREVIOUS_SURGERY_PROCEDURES: [],
			MEDICATIONS: [],
		},
		step2: {},
		step3: {},
	};
	$state.go('authentication.admission.detail.step1');
});