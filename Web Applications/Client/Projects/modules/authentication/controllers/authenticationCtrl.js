var app = angular.module('app.authentication.controller', []);
app.controller('authenticationCtrl', function($scope, AuthenticationService, $cookies, toastr, $state) {
    $scope.logout = function() {
        AuthenticationService.logout().then(function() {
            angular.forEach($cookies.getAll(), function(v, k) {
                $cookies.remove(k);
            });
            $state.go("unAuthentication.login", null, {
                location: "replace",
                reload: true
            });
        }, function(err) {
            toastr.error(err.data.message, "Error");
        })
    }
});