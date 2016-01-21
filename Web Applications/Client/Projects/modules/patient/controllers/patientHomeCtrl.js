var app = angular.module('app.authentication.patient.home.controller', [
]);

app.controller('patientHomeCtrl', function($scope, $state, $uibModal){
	$scope.eForms = function(){
		$state.go('authentication.eForms.list');
	};
	$scope.patientAdmission = function(){
		$state.go('authentication.consultation.detail.admission.detail');
	};
	$scope.consultList = function(){
		$state.go('authentication.consultation.list');
	};
});