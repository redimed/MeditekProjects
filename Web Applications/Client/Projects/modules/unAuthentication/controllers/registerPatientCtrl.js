var app = angular.module('app.unAuthentication.registerPatient.controller', []);
app.controller('registerPatientCtrl', function($scope) {
	ComponentsDropdowns.init();
	$scope.show = true;
	$scope.hide = false;

	$scope.Next = function(){
		if($scope.step1.$valid){
			$scope.show = false;
			$scope.hide = true;
		}
	};
	$scope.Back = function(){
		$scope.show = true;
		$scope.hide = false;
	};
	$scope.Submit = function(){
		console.log('step2', $scope.step2.$valid);
		if($scope.step2.$valid)
			alert('Success');
	};
});