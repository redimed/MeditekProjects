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

    //phan quoc chien

    AuthenticationService.getListDoctor({limit: 6,
        offset: 8,
        attributes: [{ "field": "FirstName" }, { "field": "LastName" }, { "field": "MiddleName" }],
        isAvatar: true})
    .then(function(data) {
        console.log("list doctor", data.data);
        $scope.listDoctor = data.data;
    });



    ioSocket.telehealthCall = function(msg) {
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
                messageTransfer(msg.to, msg.from, "answer");
            } else {
                messageTransfer(msg.to, msg.from, "decline");
            };
            o.audio.pause();
            swal.close();
        });
        o.audio.loop = true;
        o.audio.play();
    };

    ioSocket.telehealthConnect = function() {
        console.log("reconnect socketTelehealth");
        socketJoinRoom(socketTelehealth, '/api/telehealth/socket/joinRoom', { uid: $cookies.getObject('userInfo').TelehealthUser.UID });
    }

    ioSocket.authConnect = function() {
        console.log("reconnect socketAuth");
        socketJoinRoom(socketAuth, '/api/socket/makeUserOwnRoom', { UID: $cookies.getObject('userInfo').UID });
    }

    ioSocket.telehealthCancel = function(msg) {
        console.log("Cancelllllllllllllllllllllllllllllllllllllllllllllllllll", msg);
        swal.close();
        o.audio.pause();
    }
    ioSocket.telehealthDecline = function(msg) {
        console.log("declineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", msg);
        swal.close();
        o.audio.pause();
    }
    ioSocket.telehealthMisscall = function(msg) {
            alert("Miss Call");
        }
        // end chien
});
