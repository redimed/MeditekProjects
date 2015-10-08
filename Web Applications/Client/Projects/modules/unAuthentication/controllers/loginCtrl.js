var app = angular.module('app.unAuthentication.login.controller', [
]);

app.controller('loginCtrl', function($scope, $state, $cookies){
	console.log('loginCtrl');
	// $scope.$on('$viewContentLoaded', function() {
 //        Metronic.init(); // init metronic core components
 //    });
	$scope.login = function(){
		$cookies.put("userInfo","test");
		$state.go('authentication.home.list');
	};
});