var app = angular.module("app.authentication.consultation.list.controller",[
]);

app.controller('consultationListCtrl', function($scope, $state){
	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle == true ? false : true;
	};
	$scope.Detail = function(){
		$state.go("authentication.consultation.detail");
	};
});