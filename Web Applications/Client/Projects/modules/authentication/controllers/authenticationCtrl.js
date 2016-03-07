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
        // toastr.error("error data country", "ERROR");
        console.log(err);
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
    var audio = new Audio('theme/assets/global/audio/ringtone.mp3');

    socketTelehealth.funCall = function(msg) {
        console.log("CAllllllllllllllllllllllllllllllllllllllllllllllllllll", msg);
        swal({
            title: msg.fromName,
            imageUrl: "theme/assets/global/images/E-call_33.png",
            timer: 30000,
            html: "<img src='theme/assets/global/img/loading.gif' />",
            showCancelButton: true,
            confirmButtonColor: "#26C281",
            confirmButtonText: "Answer",
            cancelButtonText: "Cancel",
            cancelButtonColor: "#D91E18",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.opentokReceiveWindow = window.open($state.href("blank.receive", {
                    apiKey: msg.apiKey,
                    sessionId: msg.sessionId,
                    token: msg.token,
                    userName: msg.fromName
                }), "CAll", { directories: "no" });
            } else {
                socketTelehealth.get('/api/telehealth/socket/messageTransfer', {
                    from: msg.to,
                    to: msg.from,
                    message: "decline"
                }, function(data) {
                    console.log("send call", data);
                });
            };
            audio.pause();
            swal.close();
        });
        audio.loop = true;
        audio.play();
    };

    socketTelehealth.funConnect = function() {
        console.log("CONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
        // join room telehealth server
        console.log("+++++++++++++++++++++++++++++++++++", $cookies.getObject('userInfo'));
        socketTelehealth.get('/api/telehealth/socket/joinRoom', { uid: $cookies.getObject('userInfo').TelehealthUser.UID });
    };

    socketTelehealth.funCancel = function(msg) {
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK CAllllllllllllllllllllllllllllllllllllllllllllllllllll", msg);
        swal.close();
    }
});
