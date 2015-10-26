var app = angular.module('app.authentication.user.detail.controller',[
]);

app.controller('userDetailCtrl', function($scope, $modal){
	$scope.toggle = true;
	$scope.changePass = function(){ $scope.toggle = false; }
	$scope.backDetail = function(){ $scope.toggle = true; }
});