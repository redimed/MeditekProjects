var app = angular.module('app.unAuthentication.login.controller', []);
app.controller('loginCtrl', function($scope, $rootScope, $state, $cookies, UnauthenticatedService, toastr, $timeout, $q) {
    console.log('login')
    o.loadingPage(false);
    $scope.showClickedValidation = false;
    $scope.login = function() {
        $scope.showClickedValidation = true;
        $scope.laddaLoading = true;
        if ($scope.loginForm.$invalid) {
            $scope.laddaLoading = false;
            toastr.error("Please Input Your Username And Password!", "Error");
        } else {
            UnauthenticatedService.login($scope.user).then(function(data) {
                //-----------------------------------------------------
                //Make room for user
                socketAuth.get('/api/socket/makeUserOwnRoom', { UID: data.user.UID }, function(data, jwres) {
                    console.log('=============Socket makeUserOwnRoom===============');
                    console.log(data);
                });
                //-----------------------------------------------------
                // join room telehealth server
                socketTelehealth.get('/api/telehealth/socket/joinRoom', { uid: data.user.TelehealthUser.UID });

                if (data.user.Activated == 'Y') {
                    $cookies.putObject("userInfo", data.user);
                    console.log(data.user);
                    $cookies.put("token", data.token);
                    $rootScope.refreshCode = data.refreshCode;
                    $state.go("authentication.home.list");
                } else {
                    $cookies.putObject("userInfo", { UID: data.user.UID, token: data.token });
                    $state.go('unAuthentication.activation', null, { reload: true });
                }

            }, function(err) {
                $scope.laddaLoading = false;
                toastr.error(!err.data.message ? err.data.ErrorType : err.data.message, "Error");
            })
        }
    };
});
