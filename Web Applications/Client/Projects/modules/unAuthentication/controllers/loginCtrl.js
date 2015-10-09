var app = angular.module('app.unAuthentication.login.controller', []);
app.controller('loginCtrl', function($scope, $state, $cookies, UnauthenticatedService, toastr, $timeout) {
    $scope.showClickedValidation = false;
    $scope.login = function() {
        $scope.showClickedValidation = true;
        $scope.laddaLoading = true;
        
        if ($scope.loginForm.$invalid) {
        	$scope.laddaLoading = false;
            toastr.error("Please Input Your Username And Password!", "Error");
        } else {
        	$timeout(function(){
	        	$scope.laddaLoading = false;
	        	$cookies.put("userInfo","test");
	        	$state.go("authentication.home.list")
	        },3000);
        }
    };
});