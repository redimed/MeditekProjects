var app = angular.module('app.authentication.controller', [

]);

app.controller('authenticationCtrl', function($rootScope, $scope, $state, $cookies, AuthenticationService, toastr, CommonService, $q, notificationServices) {
    $.backstretch("destroy");
    $('body').removeClass("login");
    // Chinh kich thuoc man hinh khi su dung ipad mini
    var w = $(window).width();
    if (w <= 1024 && w >= 768) {
        document.body.className = "page-header-fixed page-sidebar-closed-hide-logo page-content-white page-sidebar-closed";
    } else {
        document.body.className = "page-header-fixed page-sidebar-closed-hide-logo page-content-white";
    }

    $scope.info = {};
    $scope.logout = function() {
        AuthenticationService.logout().then(function() {
            $rootScope.pushTrack({name:'logout', content: 'logout success'});
            socketJoinRoom(socketTelehealth, '/api/telehealth/logout', {
                uid: $cookies.getObject('userInfo').TelehealthUser.UID,
                deviceid: "30f56b7cb6a4abbc0a1ca359deb",
                systemtype: "ARD"
            });
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function(v, k) {
                if (k != 'remember')
                    $cookies.remove(k);
            });
            $state.go("unAuthentication.login", null, {
                location: "replace",
                reload: true
            });

        }, function(err) {
            toastr.error(err.data.message, "Error");
            $rootScope.pushTrack({name:'logout', content: err});
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

    // Update Read Notification

    var UserInfo = $cookies.getObject('userInfo');
    console.log("----------- UserInfo ----------");
    console.log(UserInfo);
    console.log("----------- -------- ----------");

    //phan quoc chien
    $scope.loadListDoctor = function(fullname) {
        //INTERNAL
        AuthenticationService.getListDoctor({
            Search: {
                FullName: (fullname) ? fullname : null
            },
            attributes: [{ "field": "FirstName" }, { "field": "LastName" }, { "field": "MiddleName" }],
            isAvatar: true,
            RoleID: [4]
        }).then(function(data) {
            $scope.listDoctorExternal = data.data;
        });

        //EXTERNAL 
        AuthenticationService.getListDoctor({
            Search: {
                FullName: (fullname) ? fullname : null
            },
            attributes: [{ "field": "FirstName" }, { "field": "LastName" }, { "field": "MiddleName" }],
            isAvatar: true,
            RoleID: [5]
        }).then(function(data) {
            $scope.listDoctorInternal = data.data;
        });
    };

    $scope.loadListDoctor();

    $scope.callDoctor = function(data) {
        console.log(data);
        console.log(data.UserAccount.TelehealthUser.UID);
        console.log(ioSocket.telehealthOpentok);
        console.log(((data.FirstName === null) ? "" : data.FirstName) + " " + ((data.MiddleName === null) ? "" : data.MiddleName) + " " + ((data.LastName === null) ? "" : data.LastName));
        var userInfo = $cookies.getObject('userInfo');
        var userName = ((data.FirstName === null) ? "" : data.FirstName) + " " + ((data.MiddleName === null) ? "" : data.MiddleName) + " " + ((data.LastName === null) ? "" : data.LastName);
        var userCall = data.UserAccount.TelehealthUser.UID;
        ioSocket.telehealthDoctorCallWindow = window.open($state.href("blank.call", {
            apiKey: ioSocket.telehealthOpentok.apiKey,
            sessionId: ioSocket.telehealthOpentok.sessionId,
            token: ioSocket.telehealthOpentok.token,
            userName: userName,
            uidCall: userCall,
            uidUser: userInfo.TelehealthUser.UID,
        }), "CAll", { directories: "no" });
    }

    function getRoomOpentok() {
        return $q(function(resolve, reject) {
            AuthenticationService.CreateRoomInOpentok().then(function(data) {
                ioSocket.telehealthOpentok = data.data;
                if (ioSocket.telehealthMesageCall) {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> call neee", ioSocket.telehealthMesageCall);
                    ioSocket.telehealthCall(ioSocket.telehealthMesageCall);
                    delete ioSocket.telehealthMesageCall;
                    console.log("xoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", ioSocket.telehealthMesageCall);
                }
                if (ioSocket.telehealthMesageMisscall) {
                    delete ioSocket.telehealthMesageMisscall;
                }
                console.log("telehealthOpentok", data.data);
                resolve({ message: "success", data: data.data });
            }, function(error) {
                reject({ message: "error", error: error });
            });
        });
    }

    ioSocket.getRoomOpentok = getRoomOpentok();

    ioSocket.telehealthCall = function(msg) {
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
                ioSocket.telehealthReceiveWindow = window.open($state.href("blank.receive", {
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
        socketJoinRoom(socketTelehealth, '/api/socket/joinRoom', { uid: $cookies.getObject('userInfo').TelehealthUser.UID });
    }

    ioSocket.socketAuthReconnect = function() {
        console.log("reconnect socketAuth-> makeUserOwnRoom");
        socketJoinRoom(socketAuth, '/api/socket/makeUserOwnRoom', { UID: $cookies.getObject('userInfo').UID });
    }

    ioSocket.telehealthCancel = function(msg) {
        console.log(ioSocket.telehealthSwalCall);
        swal.close();
        o.audio.pause();
    }

    ioSocket.telehealthDecline = function(msg) {
        if (ioSocket.telehealthPatientCallWindow) {
            ioSocket.telehealthPatientCallWindow.close();
        }
        if (ioSocket.telehealthDoctorCallWindow) {
            ioSocket.telehealthDoctorCallWindow.close();
        }
        swal.close();
        o.audio.pause();
    }

    ioSocket.telehealthMisscall = function(msg) {
        swal({
            title: "Miss Call From " + msg.fromName,
            imageUrl: "theme/assets/global/images/E-call_18.png",
            timer: 30000,
            html: "<img src='theme/assets/global/img/loading.gif' />",
            showCancelButton: false,
            confirmButtonColor: "#26C281",
            confirmButtonText: "OK",
            cancelButtonColor: "#D91E18",
            allowOutsideClick: false,
            allowEscapeKey: false
        });
    }
});


/* Setup Layout Part - Header */
app.controller('HeaderController', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initHeader(); // init header
    });
});
/* Setup Layout Part - Sidebar */
app.controller('SidebarController', function($scope, Restangular, $cookies, CommonService) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initSidebar(); // init sidebar
    });

    var api = Restangular.all("api");
    var result = api.one("module/GetModulesForUser");
    result.get()
        .then(function(data) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data.data.nodes);
            $scope.menus = data.data.nodes;
        }, function(err) {

        });

});
/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });

}]);

/* Setup Layout Part - Theme Panel */
// app.controller('ThemePanelController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         Demo.init(); // init theme panel
//     });
// }])

/* Setup Layout Part - Footer */
app.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initFooter(); // init footer
    });
}])
