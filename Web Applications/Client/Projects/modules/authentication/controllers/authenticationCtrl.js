var app = angular.module('app.authentication.controller', [

]);



app.controller('authenticationCtrl', function($rootScope, $scope, $state, $cookies, AuthenticationService, toastr, CommonService, $q) {
    // Chinh kich thuoc man hinh khi su dung ipad mini
    var w = $(window).width();
    if (w <= 1024 && w >= 768) {
        document.body.className = "page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-content-white page-sidebar-closed";
    } else {
        document.body.className = "page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-content-white";
    }

    $scope.$on('$includeContentLoaded', function() {
        // Layout.initHeader(); // init header
        // Layout.initSidebar(); // init sidebar
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000);
        // Demo.init(); // init theme panel
        // Layout.initFooter(); // init footer
    });

    $scope.info = {};
    $scope.logout = function() {
        AuthenticationService.logout().then(function() {
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
            $scope.listDoctorInternal = data.data;
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
            $scope.listDoctorExternal = data.data;
        });
    };

    $scope.loadListDoctor();

    $scope.callDoctor = function(data) {
        var info = {
            CallerInfo: $cookies.getObject('userInfo'),
            ReceiverName: ((data.FirstName === null) ? "" : data.FirstName) + " " + ((data.MiddleName === null) ? "" : data.MiddleName) + " " + ((data.LastName === null) ? "" : data.LastName),
            ReceiverTeleUID: data.UserAccount.TelehealthUser.UID,
            ReceiverTeleID: data.UserAccount.TelehealthUser.ID,
            ReceiverID: data.UserAccount.ID
        };
        console.log("info ", info);
        AuthenticationService.CallToReceiver(info).then(function(argument) {
            if (argument.message === 'Offline') {
                swal("Receiver Offline", "Please Call Back Later");
            } else if (argument.message === 'Busy') {
                swal("Receiver Busy", "Please Call Back Later");
            } else if (argument.message === 'Success') {
                console.log("Success", argument);
                ioSocket.telehealthDoctorCallWindow = window.open($state.href("blank.call", {
                    apiKey: argument.data.apiKey,
                    sessionId: argument.data.sessionId,
                    token: argument.data.token,
                    teleCallUID: argument.data.teleCallUID,
                    receiverName: info.ReceiverName, //userName
                    receiverUID: info.ReceiverTeleUID, //uidCall
                    callerUID: info.CallerInfo.TelehealthUser.UID, //uidUser
                }), "CAll", { directories: "no" });
            };
        });

        // console.log(data);
        // console.log(data.UserAccount.TelehealthUser.UID);
        // console.log(ioSocket);
        // console.log(((data.FirstName === null) ? "" : data.FirstName) + " " + ((data.MiddleName === null) ? "" : data.MiddleName) + " " + ((data.LastName === null) ? "" : data.LastName));
        // var userInfo = $cookies.getObject('userInfo');
        // var userName = ((data.FirstName === null) ? "" : data.FirstName) + " " + ((data.MiddleName === null) ? "" : data.MiddleName) + " " + ((data.LastName === null) ? "" : data.LastName);
        // var userCall = data.UserAccount.TelehealthUser.UID;
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

    // ioSocket.getRoomOpentok = getRoomOpentok();

    ioSocket.telehealthOpenWindow = function(msg) {
        ioSocket.telehealthDoctorCallWindow = window.open($state.href("blank.call", {
            apiKey: ioSocket.telehealthOpentok.apiKey,
            sessionId: ioSocket.telehealthOpentok.sessionId,
            token: ioSocket.telehealthOpentok.token,
            userName: userName,
            uidCall: userCall,
            uidUser: userInfo.TelehealthUser.UID,
        }), "CAll", { directories: "no" });
    }

    ioSocket.telehealthCall = function(msg) {
        console.log("isConfirm ", msg);
        swal({
            title: msg.fromName,
            imageUrl: "theme/assets/global/images/E-call_33.png",
            timer: 120000,
            html: "<img src='theme/assets/global/img/loading.gif' />",
            showCancelButton: true,
            confirmButtonColor: "#26C281",
            confirmButtonText: "Answer",
            cancelButtonText: "Cancel",
            cancelButtonColor: "#D91E18",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }, function(isConfirm) {
            if (isConfirm === true) {
                console.log("Message MSG");
                ioSocket.telehealthReceiveWindow = window.open($state.href("blank.receive", {
                    apiKey: msg.apiKey,
                    sessionId: msg.sessionId,
                    token: msg.token,
                    teleCallUID: msg.teleCallUID,
                    receiverName: msg.fromName,
                    receiverUID: msg.to,
                    callerUID: msg.from
                }), "CAll", { directories: "no" });
                // When receiver choose anwer -> join room receiver in server
                messageTransfer(msg.from, msg.to, "answer", msg.teleCallUID, true);
                swal.close();
            } else if (isConfirm === false) {
                // When receiver choose cancel
                messageTransfer(msg.from, msg.to, "decline", msg.teleCallUID, true);
                swal.close();
            } else {
                // When receiver no choose and waiting 2m
                console.log("callerInfo waiting ", msg.callerInfo);
                messageTransfer(msg.from, msg.to, "waiting", msg.callerInfo, false);
            };
            o.audio.pause();
        });
        o.audio.loop = true;
        o.audio.play();
    };

    ioSocket.telehealthConnect = function() {
        console.log("reconnect socketTelehealth");
        socketJoinRoom(socketTelehealth, '/api/telehealth/socket/joinRoom', { uid: $cookies.getObject('userInfo').TelehealthUser.UID });
    }

    ioSocket.socketAuthReconnect = function() {
        console.log("reconnect socketAuth-> makeUserOwnRoom");
        socketJoinRoom(socketAuth, '/api/socket/makeUserOwnRoom', { UID: $cookies.getObject('userInfo').UID });
    }

    ioSocket.telehealthCancel = function(msg) {
        console.log("Cancelllllllllllllllllllllllllllllllllllllllllllllllllll", msg);
        if (ioSocket.telehealthPatientCallWindow) {
            ioSocket.telehealthPatientCallWindow.close();
        }
        if (ioSocket.telehealthDoctorCallWindow) {
            ioSocket.telehealthDoctorCallWindow.close();
        }
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
        swal("Receiver Busy", "Please Call Back Later");
        o.audio.pause();
    }

    ioSocket.telehealthMisscall = function(msg) {
        if (msg.length > 0) {
            var q = _.uniq(msg, 'ID');
            var CallerName = "";
            for (var i = 0; i < q.length; i++) {
                if (i === q.length - 1) {
                    CallerName = CallerName + q[i].UserName;
                } else {
                    CallerName = CallerName + q[i].UserName + " ,";
                }
            }
            swal({
                title: "Miss Call",
                text: "You have " + msg.length + " miss call from " + CallerName,
                imageUrl: "theme/assets/global/images/E-call_18.png",
                showCancelButton: false,
                confirmButtonText: "OK"
            }, function(isConfirm) {
                if (isConfirm === true) {
                    // when user confirm go to server and delete misscall in redis
                    var CallerInfo = $cookies.getObject('userInfo');
                    console.log("CallerInfo UID", CallerInfo.TelehealthUser.UID);
                    messageTransfer("null", CallerInfo.TelehealthUser.UID, "delredis");
                }
            });
        }
    }

    ioSocket.telehealthIssue = function(msg) {
        console.log("Issueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", msg);
        if (ioSocket.telehealthPatientCallWindow) {
            ioSocket.telehealthPatientCallWindow.close();
        }
        if (ioSocket.telehealthDoctorCallWindow) {
            ioSocket.telehealthDoctorCallWindow.close();
        }
        if (ioSocket.telehealthReceiveWindow) {
            console.log("close receive");
            ioSocket.telehealthReceiveWindow.close();
        }
        // swal.close();
        o.audio.pause();
        swal("Device partner issue", "Please Call Back Later");
    }

    ioSocket.telehealthWaiting = function(msg) {
        console.log("Waitinggggggggggggggggggggggggggggggggggggggggg", msg);
        if (msg.misscall) {
            ioSocket.telehealthMisscall(msg.misscall);
        } else {
            if (ioSocket.telehealthPatientCallWindow) {
                ioSocket.telehealthPatientCallWindow.close();
            }
            if (ioSocket.telehealthDoctorCallWindow) {
                ioSocket.telehealthDoctorCallWindow.close();
            }
            o.audio.pause();
            swal("Receiver Busy", "Please Call Back Later");
        }
    }
});


/* Setup Layout Part - Header */
// app.controller('HeaderController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         Layout.initHeader(); // init header
//     });
// }]);
/* Setup Layout Part - Sidebar */
// app.controller('SidebarController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         Layout.initSidebar(); // init sidebar
//     });
// }]);
/* Setup Layout Part - Quick Sidebar */
// app.controller('QuickSidebarController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         setTimeout(function() {
//             QuickSidebar.init(); // init quick sidebar        
//         }, 2000)
//     });
// }]);

/* Setup Layout Part - Theme Panel */
// app.controller('ThemePanelController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         Demo.init(); // init theme panel
//     });
// }])

/* Setup Layout Part - Footer */
// app.controller('FooterController', ['$scope', function($scope) {
//     $scope.$on('$includeContentLoaded', function() {
//         Layout.initFooter(); // init footer
//     });
// }])