var app = angular.module('app.blank.receive.controller', []);

app.controller('receiveCtrl', function($scope, $stateParams, $timeout, $window, AuthenticationService, $cookies, OTSession, toastr) {
    var apiKey = $stateParams.apiKey;
    var sessionId = $stateParams.sessionId;
    var token = $stateParams.token;
    var EndCall = "";
    var receiverTeleUID = ($stateParams.receiverTeleUID) ? $stateParams.receiverTeleUID : null;
    var callerTeleUID = ($stateParams.callerTeleUID) ? $stateParams.callerTeleUID : null;
    var teleCallUID = $stateParams.teleCallUID;
    var teleCallID = $stateParams.teleCallID;
    var streamLength = $stateParams.streamLength;
    $scope.callName = $stateParams.callName;
    var session = OT.initSession(apiKey, sessionId);
    $scope.reverse = true;
    console.log(apiKey);
    console.log(sessionId);
    console.log(token);
    var userInfo = $cookies.getObject('userInfo');
    console.log("$stateParams", $stateParams);
    console.log("userInfo", userInfo);
    o.loadingPage(true);
    $scope.receiveFail = false;

    if (!userInfo) {
        $state.go("unAuthentication.login");
        return;
    };

    function Message(status, name) {
        try {
            toastr.info(name + ' ' + status + ' , Please Call Back Later');
            if ($scope.streams.length <= 0) {
                $timeout.cancel(mytimeout);
                o.loadingPage(false);
                $scope.receiveStatus = name + ' ' + status;
                $scope.receiveFail = true;
            };
        } catch (err) {
            console.log("Message", err);
        };
    };

    function toastrMessage(UserTeleUID) {
        socketTelehealth.on('addMessage', function(msg) {
            console.log("Show messageeeeeeeeeeeeeeeeeeeeeee", msg);
            switch (msg.message) { // Send to all room
                case "quitcall":
                    toastr.error(msg.quitName + ' have out room');
                    break;
                case "calling":
                    toastr.success(msg.receiverName + ' have join room');
                    break;
                case "cancel":
                    Message("Cancel", msg.cancelName);
                    break;
            }
            if (msg.callerTeleUID === UserTeleUID) { // Send to Caller
                switch (msg.message) {
                    case "offline":
                        Message("Offline", msg.receiverName);
                        break;
                    case "busy":
                        Message("Busy", msg.receiverName);
                        break;
                    case "decline":
                        Message("Decline", msg.receiverName);
                        break;
                    case "issue":
                        Message("Issue", msg.issueName);
                        break;
                    case "waiting":
                        Message("Waiting", msg.receiverName);
                        break;
                    case "calling":
                        $scope.toggle = false;
                        break;
                };
            };
        });
    };

    function Calling() {
        var info = {
            callerTeleUID: callerTeleUID,
            receiverTeleUID: receiverTeleUID,
            message: "calling",
            teleCallUID: teleCallUID,
            receiverName: userInfo.UserName
        };
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(data) {
            console.log("send call", data);
        });
    };

    OTSession.init(apiKey, sessionId, token, function(error) {
        try {
            console.log("OTSession");
            if (!error) {
                $scope.joinRoomCall(teleCallUID);
                toastrMessage(userInfo.TelehealthUser.UID);
            } else {
                console.log('There was an error connecting to the session: ', error.code, error.message);
            }
        } catch (err) {
            console.log("OTSession : ", err);
        }
    });

    $scope.streams = OTSession.streams;

    $scope.$on("otLayout", function() {
        o.audio.pause();
    });

    // session.on("connectionDestroyed", function(event) {
    //     toastr.error('Disconnected , The session disconnected.');
    // });

    session.on("signal:endCall", function(event) {
        console.log("Signal sent from connection ", event);
        if ($scope.streams.length <= 1) {
            window.close();
        }
    });

    session.on("streamDestroyed", function(event) {
        // event.reason = "networkDisconnected";
        // event.reason = "clientDisconnected";
        console.log(event);
        if (event.reason === "networkDisconnected") {
            if ($scope.streams.length <= 0) {
                EndCall = "destroy";
                window.close();
            } else {
                toastr.error('Disconnected with 1 person');
            }
        }
    });

    $scope.$on("otStreamDestroyed", function(event, args) {
        EndCall = "issue";
        window.close();
    });

    $scope.$on("otStreamCreated", function(event, args) {
        $scope.stream = args.stream;
        Calling();
        var mytimeout = $timeout($scope.onTimeout, 1000);
    });

    $scope.counter = 0;

    $scope.onTimeout = function() {
        $scope.counter++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.audio = true;
    $scope.closeAudio = function() {
        try {
            $scope.stream.publisher.publishAudio(!$scope.audio);
            $scope.audio = !$scope.audio;
        } catch (err) {
            console.log("closeAudio", err);
        }
    };

    $scope.EndCall = function() {
        window.close();
    };

    var cancel = false;

    $scope.cancel = function() {
        EndCall = "cancel";
        window.close();
    };

    function messageTransfer(data) {
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(data) {
            console.log("send call", data);
        });
    };

    function CallCancel(message) {
        var info = {
            callerTeleUID: callerTeleUID,
            receiverTeleUID: receiverTeleUID,
            message: message,
            teleCallUID: teleCallUID
        };
        if (message === "endcall") {
            if ($scope.streams.length === 1) {
                session.signal({
                        data: "end",
                        type: "endCall"
                    },
                    function(error) {
                        if (error) {
                            console.log("signal error (" + error.code + "): " + error.message);
                        } else {
                            console.log("signal sent.");
                        }
                    }
                );
                session.disconnect();
                info.UserUid = receiverTeleUID;
            } else {
                info.userquit = receiverTeleUID;
                info.quitName = userInfo.UserName;
                info.message = "quitcall";
            };
        };
        if (message === "destroy") {
            info.currentUID = receiverTeleUID;
        };
        if (message === "issue") {
            info.noissue = callerTeleUID;
            info.issue = receiverTeleUID;
            info.issueName = userInfo.UserName;
        };
        if (message === "cancel") {
            info.cancel = receiverTeleUID;
            info.cancelName = userInfo.UserName;
        };
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(data) {
            console.log("send call", data);
        });
    }

    $scope.loadListDoctor();

    // $scope.$on("changeSize", function(event, stream) {
    //     if (stream.oth_large === undefined) {
    //         stream.oth_large = true;
    //     }
    //     if (stream.oth_large === false) {
    //         for (var i = 0; i < $scope.streams.length; i++) {
    //             if ($scope.streams[i] === stream) {
    //                 $scope.streams[i].oth_large = !stream.oth_large;
    //                 console.log("========== ", $scope.streams[i].oth_large);
    //             };
    //         };
    //         if (reverse) {
    //             $scope.streams.reverse();
    //         } else {
    //             reverse = true;
    //         };
    //     } else {
    //         for (var i = 0; i < $scope.streams.length; i++) {
    //             if ($scope.streams[i] === stream) {
    //                 $scope.streams[i].oth_large = !stream.oth_large;
    //                 console.log("!!!!!!!!! ", $scope.streams[i].oth_large);
    //             };
    //         };
    //         if ($scope.streams[0] == stream) {
    //             reverse = false;
    //         };
    //     };
    //     setTimeout(function() {
    //         event.targetScope.$emit("otLayout");
    //     }, 200);
    // });

    $scope.addDoctor = function(doctor) {
        try {
            if ($scope.streams.length < 2) {
                console.log("add call");
                var info = {
                    message: "call",
                    sessionId: sessionId,
                    callerInfo: userInfo,
                    callName: $scope.callName,
                    receiverInfo: doctor.UserAccount,
                    receiverName: ((doctor.FirstName === null) ? "" : doctor.FirstName) + " " + ((doctor.MiddleName === null) ? "" : doctor.MiddleName) + " " + ((doctor.LastName === null) ? "" : doctor.LastName),
                    teleCallID: teleCallID,
                    teleCallUID: teleCallUID
                };
                socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(data) {
                    console.log("send call", data);
                    window.close();
                });
            } else {
                swal("Cann't Call", "You can not call more than 3 people!");
            }
        } catch (err) {
            console.log("$scope.addDoctor ", err)
        };
    };

    $scope.toggle = false;
    $scope.zoom = true;
    $scope.size = '900px';
    $scope.src = 'E-call_09.png';

    $scope.listUser = function() {
        $scope.toggle = $scope.toggle === true ? false : true;
    };

    $scope.ZoomScreen = function(size) {
        var elem = document.body; // Make the body go full screen.
        var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);

        if (isInFullScreen) {
            cancelFullScreen(document);
            $scope.src = 'E-call_09.png';
        } else {
            requestFullScreen(elem);
            $scope.src = 'E-call_10.png'
        }
    };

    function requestFullScreen(element) {
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    function cancelFullScreen(element) {
        var requestMethod = element.cancelFullScreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.exitFullscreen;
        if (requestMethod) { // cancel full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    // Even when close window
    $window.onbeforeunload = function(event) {
        return (EndCall === "" ? CallCancel("endcall") : CallCancel(EndCall));
    };
});

app.filter('formatTimer', function() {
    return function(input) {
        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        var hours = Math.floor(minutes / 60);
        return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
    };
});
