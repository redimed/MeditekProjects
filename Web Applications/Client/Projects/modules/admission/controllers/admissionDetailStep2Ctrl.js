var app = angular.module('app.authentication.admission.detail.step2.controller',[]);

app.controller('admissionDetailStep2Ctrl', function($scope, $state){
	angular.element(".progress-bar").attr("style","width:60%");
	// $scope.roles = ['guest','user','customer','admin'];
	// $scope.cusotmer = {roles:[]};
	$scope.submit = function(){
		$scope.submitted = true;
		console.log($scope.form.$valid);
		if($scope.form.$valid){
			$state.go("authentication.admission.detail.step3");
		}
		// else
		// 	$scope.submitted = false;
	};
});