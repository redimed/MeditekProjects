var app = angular.module('app.unAuthentication.register.controller', [
]);

app.controller('registerCtrl', function($scope){
	$scope.show_hide = true;
	$scope.btn_next = function(){
		// $scope.show_hide = false;
		$scope.step++;
	}
	$scope.btn_back = function(){
		// $scope.show_hide =s true;
		$scope.step--;
	}
	$scope.step = 1;
});