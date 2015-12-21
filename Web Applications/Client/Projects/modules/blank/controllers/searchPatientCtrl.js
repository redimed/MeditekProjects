var app = angular.module('app.blank.searchPatient.controller', []);
app.controller('searchPatientCtrl', function($scope) {
	$scope.step1 = true;
	$scope.step2 = false;
	$scope.SubmitSearch = function(){
		if($scope.search.$valid){
			$scope.step1 = false;
			$scope.step2 = true;
		}
	};
	$scope.Cancel = function(){
		$scope.step1 = true;
		$scope.step2 = false;
	};
	$scope.SubmitActivation = function(){
		if($scope.activation.$valid)
			alert('success');
	};
});