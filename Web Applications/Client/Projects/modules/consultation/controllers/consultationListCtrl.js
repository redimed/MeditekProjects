var app = angular.module("app.authentication.consultation.list.controller",[
]);

app.controller('consultationListCtrl', function($scope){
	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle == true ? false : true;
	};
});