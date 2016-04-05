var app = angular.module('app.unAuthentication.login.controller', []);
app.controller('loginCtrl', function($scope, $rootScope, $state, $cookies, UnauthenticatedService, toastr, $timeout, $q) {
    console.log('login');
    $timeout(function(){
        if(_.isEmpty($cookies.getObject('remember')) == false) {
            $scope.user = {};
            $scope.user.UserName = $cookies.getObject('remember').UserName;
            $scope.user.check = $cookies.getObject('remember').check;
        }
    },0);
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

                //put username into cookies to remember
                if($scope.user.check === 1 || $scope.user.check === '1'){
                    $cookies.putObject("remember", { UserName: $scope.user.UserName, check: $scope.user.check });
                }
                else {
                    if(_.isEmpty($cookies.getObject('remember')) == false) {
                        $cookies.remove('remember');
                    }
                }

                // join room auth server
                if (!_.isEmpty(socketAuth)) {
                    socketJoinRoom(socketAuth, '/api/socket/makeUserOwnRoom', { UID: data.user.UID });
                }
                //-----------------------------------------------------
                // join room telehealth server
                if (!_.isEmpty(socketTelehealth)) {
                    socketJoinRoom(socketTelehealth, '/api/telehealth/socket/joinRoom', { uid: data.user.TelehealthUser.UID });
                }
                //-----------------------------------------------------

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
