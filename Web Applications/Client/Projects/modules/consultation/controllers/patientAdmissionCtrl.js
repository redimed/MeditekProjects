var app = angular.module("app.authentication.consultation.detail.patientAdmission.controller",[
]);

app.controller('patientAdmissionCtrl', function($scope){
	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle == true ? false : true;
	};
});