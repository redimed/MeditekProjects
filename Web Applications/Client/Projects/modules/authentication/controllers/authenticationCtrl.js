var app = angular.module('app.authentication.controller', [

]);

app.controller('authenticationCtrl', function($rootScope, $scope, $state, $cookies, AuthenticationService, toastr, CommonService, $q) {
    $.backstretch("destroy");
    $('body').removeClass("login");
    // Chinh kich thuoc man hinh khi su dung ipad mini
    var w = $(window).width();
    if (w <= 1024 && w >= 768) {
        document.body.className = "page-header-fixed page-sidebar-closed-hide-logo page-content-white page-sidebar-closed";
    } else {
        document.body.className = "page-header-fixed page-sidebar-closed-hide-logo page-content-white";
    }

    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        // Layout.initSidebar(); // init sidebar
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000);
        Layout.initFooter(); // init footer
    });

    var UserInfo = $cookies.getObject('userInfo');
    $scope.Role = UserInfo.roles[UserInfo.roles.length - 1].RoleCode;
    console.log("User Info ", $cookies.getObject('userInfo'));

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
        // console.log('loadListDoctor! ', 'background: #222; color: #bada55');

        //External
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

        //Internal  
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

    $scope.loadListNotify = function() {
        // var roles = UserInfo.roles;
        var userUID = UserInfo.UID;
        var queue = 'NOTIFY';

        console.log('%c loadListNotify!!!!!!!!!!!!!!!!!!!!!!! ', 'background: #222; color: #bada55');
        AuthenticationService.getListNotify({
            userUID: userUID,
            queue: queue
        }).then(function(data) {
            for (var i = 0; i < data.data.length; i++) {
                data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
            };
            console.log("listNotify", data.data);
            console.log("listNotify", data.count);
            $scope.listNotify = data.data;
            $scope.UnReadCount = data.count;
        });
    };

    $scope.loadListNotify();

    $scope.callDoctor = function(data) {
        console.log("Start Call Doctor !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        var info = {
            message: "startcall",
            callerInfo: UserInfo,
            receiverInfo: data.UserAccount,
            callName: UserInfo.UserName + ", " + ((data.FirstName === null) ? "" : data.FirstName) + " " + ((data.MiddleName === null) ? "" : data.MiddleName) + " " + ((data.LastName === null) ? "" : data.LastName)
        };
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(data) {
            console.log("send call", data);
        });
    };

    $scope.updateReadQueueJob = function() {
        if ($scope.UnReadCount > 0) {
            var userUID = UserInfo.UID;
            var queue = 'NOTIFY';
            AuthenticationService.updateReadQueueJob({
                userUID: userUID,
                queue: queue
            }).then(function(data) {
                if (data.status === 'success') {
                    $scope.loadListNotify();
                };
            }, function(err) {
                console.log("updateReadQueueJob ", err);
            });
        };
    };

    ioSocket.telehealthStartCall = function(msg) {
        ioSocket.telehealthDoctorCallWindow = window.open($state.href("blank.call", {
            apiKey: msg.data.apiKey,
            sessionId: msg.data.sessionId,
            token: msg.data.token,
            teleCallUID: msg.data.teleCallUID,
            teleCallID: msg.data.teleCallID,
            callName: msg.data.callName,
            receiverUID: msg.data.receiverUID,
            receiverTeleUID: msg.data.receiverTeleUID,
            callerTeleUID: UserInfo.TelehealthUser.UID
        }), "CAll", { directories: "no" });
    };

    ioSocket.telehealthCall = function(msg) {
        console.log("msg ", msg);
        swal({
            title: msg.callerName,
            imageUrl: "theme/assets/global/images/E-call_33.png",
            timer: 10000,
            html: "<img src='theme/assets/global/img/loading.gif' />",
            showCancelButton: true,
            confirmButtonColor: "#26C281",
            confirmButtonText: "Answer",
            cancelButtonText: "Cancel",
            cancelButtonColor: "#D91E18",
            allowOutsideClick: false,
            allowEscapeKey: false
        }, function(isConfirm) {
            if (isConfirm === true) {
                console.log("Message MSG");
                ioSocket.telehealthReceiveWindow = window.open($state.href("blank.receive", {
                    apiKey: msg.apiKey,
                    sessionId: msg.sessionId,
                    token: msg.token,
                    teleCallUID: msg.teleCallUID,
                    teleCallID: msg.teleCallID,
                    callName: msg.callName,
                    receiverTeleUID: msg.receiverTeleUID,
                    callerTeleUID: msg.callerTeleUID
                }), "CAll", { directories: "no" });
                // When receiver choose anwer
                messageTransfer(msg.callerTeleUID, msg.receiverTeleUID, "answer", msg.receiverName, msg.teleCallUID, null);
                swal.close();
            } else if (isConfirm === false) {
                // When receiver choose cancel
                console.log("callerTeleUID", msg.callerTeleUID);
                messageTransfer(msg.callerTeleUID, msg.receiverTeleUID, "decline", msg.receiverName, msg.teleCallUID, null);
                swal.close();
            } else if (isConfirm === null) {
                // When receiver no choose and waiting timer
                console.log("teleCallUID waiting ", msg.teleCallUID);
                messageTransfer(msg.callerTeleUID, msg.receiverTeleUID, "waiting", msg.receiverName, msg.teleCallUID, msg.callerInfo);

            }
            o.audio.pause();
        });
        o.audio.loop = true;
        o.audio.play();
    };

    ioSocket.telehealthConnect = function() {
        console.log("reconnect socketTelehealth");
        socketJoinRoom(socketTelehealth, '/api/telehealth/socket/joinRoom', { uid: $cookies.getObject('userInfo').TelehealthUser.UID });
    };

    ioSocket.socketAuthReconnect = function() {
        console.log("reconnect socketAuth-> makeUserOwnRoom");
        socketJoinRoom(socketAuth, '/api/socket/makeUserOwnRoom', { UID: $cookies.getObject('userInfo').UID });
    };

    ioSocket.telehealthCancel = function(msg) {
        console.log("Cancelllllllllllllllllllllllllllllllllllllllllllllllllll", msg);
        if (ioSocket.telehealthDoctorCallWindow) {
            ioSocket.telehealthDoctorCallWindow.close();
        }
        if (ioSocket.telehealthReceiveWindow) {
            ioSocket.telehealthReceiveWindow.close();
        }
        swal.close();
        o.audio.pause();
    }

    ioSocket.telehealthDecline = function(msg) {
        console.log("declineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", msg);
        if (ioSocket.telehealthPatientCallWindow) {
            ioSocket.telehealthPatientCallWindow.close();
        }
        if (ioSocket.telehealthDoctorCallWindow) {
            ioSocket.telehealthDoctorCallWindow.close();
        }
        swal("Receiver Busy", "Please Call Back Later");
        o.audio.pause();
    };

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
                    console.log("CallerInfo UID", UserInfo.TelehealthUser.UID);
                    messageTransfer("null", UserInfo.TelehealthUser.UID, "delmisscall");
                }
            });
        }
    };

    ioSocket.telehealthIssue = function(msg) {
        console.log("Issueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", msg);
        if (ioSocket.telehealthDoctorCallWindow && ioSocket.telehealthDoctorCallWindow != null) {
            ioSocket.telehealthDoctorCallWindow.close();
            ioSocket.telehealthDoctorCallWindow = null;
        }
        if (ioSocket.telehealthReceiveWindow && ioSocket.telehealthReceiveWindow != null) {
            ioSocket.telehealthReceiveWindow.close();
            ioSocket.telehealthReceiveWindow = null;
        }
        // swal.close();
        o.audio.pause();
        // if (msg.noissue === UserInfo.TelehealthUser.UID) {
        //     swal("Device issue", "Please Call Back Later");
        // } else {
        swal("Device issue", "Please Check Again System and Call Back Later");
        // };
    };

    ioSocket.telehealthWaiting = function(msg) {
        console.log("Waitinggggggggggggggggggggggggggggggggggggggggg", msg);
        if (msg.misscall) {
            ioSocket.telehealthMisscall(msg.misscall);
        } else {
            if (ioSocket.telehealthDoctorCallWindow && ioSocket.telehealthDoctorCallWindow != null) {
                ioSocket.telehealthDoctorCallWindow.close();
                ioSocket.telehealthDoctorCallWindow = null;
            };
            o.audio.pause();
            swal("Receiver Waiting", "Please Call Back Later");
        };
    };

    ioSocket.telehealthDestroy = function(msg) {
        swal("Destroy", "Please Call Back Later");
    };

    ioSocket.telehealthAnswer = function(msg) {
        o.audio.pause();
        swal.close();
    };

    ioSocket.telehealthNotify = function(msg) {
        $scope.loadListNotify();
        var msgContent = JSON.parse(msg);
        toastr.success(msgContent.Appointment.Code + " " + msgContent.action, "Notification");
    };

    // No using
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
    };
});



/* Setup Layout Part - Header */
app.controller('HeaderController', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
});
/* Setup Layout Part - Sidebar */
app.controller('SidebarController', function($scope, Restangular,$cookies,CommonService) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initSidebar(); // init sidebar
    });

    var api = Restangular.all("api");
    var result = api.one("module/GetModulesForUser");
    result.get()
    .then(function(data){
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data.data.nodes);
        $scope.menus=data.data.nodes;
    },function(err){
        
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
        Layout.initFooter(); // init footer
    });
}])
