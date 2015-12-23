var app = angular.module('app.blank.searchPatient.controller', []);
app.controller('searchPatientCtrl', function($scope) {
	$scope.number = 1;
	$scope.submitted = false;
	$scope.next = function(){
		$scope.submitted = true;
		if($scope.step1.$valid){
			$scope.number++;
			$scope.submitted = false;
		}
	};
	$scope.Back = function(){
		$scope.submitted = true;
		if($scope.step2.$valid){
			$scope.number--;
		}
	};
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.step2.$valid)
			alert('success');
	};
});