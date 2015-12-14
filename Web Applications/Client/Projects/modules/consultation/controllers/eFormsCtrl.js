var app = angular.module("app.authentication.consultation.detail.eForms.controller",[
]);

app.controller('eFormsCtrl', function($scope){
	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle == true ? false : true;
	};
});