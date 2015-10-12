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
            UnauthenticatedService.login($scope.user).then(function(data) {
                $cookies.putObject("userInfo", data.user);
                $cookies.put("token", data.token);
                $state.go("authentication.home.list")
            }, function(err) {
                $scope.laddaLoading = false;
                toastr.error(err.data.message, "Error");
            })
        }
    };
});