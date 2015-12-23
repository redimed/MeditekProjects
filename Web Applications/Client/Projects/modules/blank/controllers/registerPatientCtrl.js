var app = angular.module('app.blank.registerPatient.controller', []);
app.controller('registerPatientCtrl', function($scope) {
	ComponentsDropdowns.init();
	$scope.number = 1;
	$scope.submitted = false;
	$scope.data = {};
	$scope.Next = function(number){
		$scope.submitted = true;
		if($scope.step1.$valid && number == 1){
			$scope.number++;
			$scope.submitted = false;
		}
		if($scope.step2.$valid && number == 2){
			$scope.number++;
			$scope.submitted = false;
		}
	};
	$scope.Back = function(){
		$scope.submitted = true;
		if($scope.step1.$valid || $scope.step2.$valid){
			$scope.number--;
			
		}
	};
	$scope.Submit = function(){
		$scope.submitted = true;
		if($scope.step3.$valid){
			alert('Success');
		}
	};
});