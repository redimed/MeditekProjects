var app = angular.module('app.authentication.controller', [

]);

app.controller('authenticationCtrl', function($rootScope, $scope, $state, $cookies, AuthenticationService, toastr, CommonService) {
    $scope.info = {};
    $scope.logout = function() {
        AuthenticationService.logout().then(function() {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function(v, k) {
                $cookies.remove(k);
            });
            $state.go("unAuthentication.login", null, {
                location: "replace",
                reload: true
            });
        }, function(err) {
            toastr.error(err.data.message, "Error");
        })
    };
    AuthenticationService.getListCountry().then(function(result) {
        $rootScope.countries = result.data;
    }, function(err) {
        toastr.error("error data country", "ERROR");
    });
    var data = {
        UID: $cookies.getObject('userInfo').UID
    };
    AuthenticationService.getDetailUser(data).then(function(response) {
        $scope.info = response.data;
        $cookies.putObject("userprofile", {
            patient: $scope.info.patient,
            doctor: $scope.info.doctor
        });

    }, function(err) {
        console.log(err);
    });

    $rootScope.titles = [{
        id: "0",
        name: 'Mr'
    }, {
        id: "1",
        name: 'Mrs'
    }, {
        id: "2",
        name: 'Ms'
    }, {
        id: "3",
        name: 'Dr'
    }];

    $rootScope.gender = [{
        value: "M",
        name: 'Male'
    }, {
        value: "F",
        name: 'Female'
    }];

    $rootScope.states = [{
        name: 'Victoria'
    }, {
        name: 'New South Wales'
    }, {
        name: 'Queensland'
    }, {
        name: 'Austria Capital Territory'
    }, {
        name: 'Northern Territory'
    }, {
        name: 'Western Australia'
    }, {
        name: 'Tasmania'
    }];

    $rootScope.insurers = [{
        name: 'Insurer Company'
    }, {
        name: 'Mineral Resources'
    }, {
        name: 'Mesa Minerals'
    }];
    $rootScope.Account_types = [{
        name: 'Titanium Privilege Account'
    }, {
        name: '3-in-1 Account'
    }, {
        name: 'Silver Savings Account'
    }];
    //phan quoc chien get detail open tok
    function OpentokCreateSession() {
        AuthenticationService.getDetailOpentok().then(function(data) {
            $scope.Opentok = {
                apiKey: data.data.apiKey,
                sessionId: data.data.sessionId,
                token: data.data.token
            }
        });
    };

    OpentokCreateSession();
    
    //phan quoc chien join room
    function OpenTokJoinRoom() {
        io.socket.get('/api/telehealth/socket/joinRoom', {
            uid: $cookies.getObject('userInfo').UID
        }, function(data) {
            console.log("JoinRoom", data);
        });
    };

    OpenTokJoinRoom();
});
