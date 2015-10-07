var app = angular.module('app.unAuthentication.login.controller', [
]);

app.controller('loginCtrl', function($scope, $state){
	console.log('loginCtrl');
	// $scope.$on('$viewContentLoaded', function() {
 //        Metronic.init(); // init metronic core components
 //    });
	$scope.login = function(){
		$state.go('authentication.home.list');
	};
});