var app = angular.module('app.authentication.admission.request.controller',[
	'app.authentication.admission.request.step1.controller',
	'app.authentication.admission.request.step2.controller',
	'app.authentication.admission.request.step3.controller',
]);
app.controller('admissionRequestCtrl',function($scope, $state, $stateParams){
	$state.go('authentication.consultation.detail.admission.request.step1');
	console.log("$stateParams",$stateParams.data.UID);
	$scope.admissionRequest = {};
});