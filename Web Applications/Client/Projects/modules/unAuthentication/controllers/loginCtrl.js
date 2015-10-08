var app = angular.module('app.unAuthentication.login.controller', []);
app.controller('loginCtrl', function($scope, $state, $cookies, UnauthenticatedService, toastr) {
    $scope.showClickedValidation = false;
    $scope.login = function() {
        $scope.showClickedValidation = true;
        if ($scope.loginForm.$invalid) {
            toastr.error("Please Input Your Username And Password!", "Error");
        } else {
            toastr.success("Heeelo");
        }
    };
});
