var app = angular.module('app.authentication.admission.request.step2.controller',[]);

app.controller('admissionRequestStep2Ctrl', function($scope, $state, $timeout){
	$timeout(function(){
        App.initAjax();
    },0);
	angular.element(".progress-bar").attr("style","width:60%");
	// $scope.roles = ['guest','user','customer','admin'];
	// $scope.cusotmer = {roles:[]};
	$scope.submit = function(){
		$scope.submitted = true;
		console.log($scope.form.$valid);
		if($scope.form.$valid){
			$state.go("authentication.consultation.detail.admission.request.step3");
		}
		// else
		// 	$scope.submitted = false;
	};
	$scope.resertSubstancesData = function(){
        $scope.admissionRequest.allergies_alerts_substances_list = "";
    }
});