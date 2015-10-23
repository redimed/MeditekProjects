var app = angular.module('app.authentication.user.Profile.controller',[
]);

app.controller('userProfileCtrl', function($scope, $modal){
	$scope.toggle = true;
	$scope.changePass = function(){ $scope.toggle = false; }
	$scope.backProfile = function(){ $scope.toggle = true; }
});