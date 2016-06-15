var app = angular.module('app.blank.call.controller', []);

app.controller('callCtrl', function($scope, $stateParams, $state, $timeout, $cookies, $window, AuthenticationService, OTSession, toastr) {
    var apiKey = $stateParams.apiKey;
    var sessionId = $stateParams.sessionId;
    var token = $stateParams.token;
    var teleCallUID = $stateParams.teleCallUID;
    var teleCallID = $stateParams.teleCallID;
    var receiverUID = $stateParams.receiverUID;
    var receiverTeleUID = $stateParams.receiverTeleUID;
    var callerTeleUID = $stateParams.callerTeleUID;
    $scope.callName = $stateParams.callName;
    var session = OT.initSession(apiKey, sessionId);
    var userInfo = $cookies.getObject('userInfo');
    var EndCall = "";
    var reverse = true;
    var mytimeout;
    console.log(apiKey);
    console.log(sessionId);
    console.log(token);
    console.log("userInfo", userInfo);
    console.log("$stateParams", $stateParams);
    o.loadingPage(true);
    var receiverInfo = {
        UID: receiverUID,
        TelehealthUser: {
            UID: receiverTeleUID
        }
    };
    $scope.callFail = false;

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
                $scope.callStatus = name + ' ' + status;
                $scope.callFail = true;
            };
        } catch (err) {
            console.log("Message ", err);
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
            };
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

    function sendCall() {
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', {
            message: "call",
            callerInfo: userInfo,
            receiverInfo: receiverInfo,
            callName: $scope.callName,
            sessionId: sessionId,
            teleCallID: teleCallID,
            teleCallUID: teleCallUID
        }, function(data) {
            console.log("send call", data);
        });
        o.audio.loop = true;
        o.audio.play();
    };

    $scope.counter = 0;

    $scope.onTimeout = function() {
        $scope.counter++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    OTSession.init(apiKey, sessionId, token, function(err) {
        try {
            if (!err) {
                if (!_.isEmpty(socketTelehealth)) {
                    $scope.joinRoomCall(teleCallUID);
                    sendCall();
                    toastrMessage(userInfo.TelehealthUser.UID);
                } else {
                    ioSocket.telehealthConnect = function() {
                        $scope.joinRoomCall(teleCallUID);
                        sendCall();
                        toastrMessage(userInfo.TelehealthUser.UID);
                    }
                };
            };
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
            };
        };
    });

    $scope.$on("otStreamDestroyed", function(event, args) {
        EndCall = "issue";
        window.close();
    });

    $scope.$on("otStreamCreated", function(event, args) {
        $scope.stream = args.stream;
        mytimeout = $timeout($scope.onTimeout, 1000);
    });

    $scope.$on("changeSize", function(event, stream) {
        console.log(stream);
        if (stream.oth_large === undefined) {
            stream.oth_large = true;
        }
        if (stream.oth_large === false) {
            for (var i = 0; i < $scope.streams.length; i++) {
                if ($scope.streams[i] === stream) {
                    $scope.streams[i].oth_large = true;
                    console.log("false", $scope.streams[i].oth_large);
                }
            }
            if (reverse === true) {
                $scope.streams.reverse();
            } else {
                reverse = true;
            }
        } else {
            for (var i = 0; i < $scope.streams.length; i++) {
                if ($scope.streams[i] !== stream) {
                    $scope.streams[i].oth_large = false;
                    console.log("true", $scope.streams[i].oth_large);
                }
            }
            if ($scope.streams[0] === stream) {
                reverse = false;
            }
        }
        setTimeout(function() {
            event.targetScope.$emit("otLayout");
        }, 200);
    });

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

    $scope.cancel = function() {
        EndCall = "cancel";
        window.close();
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
                info.UserUid = callerTeleUID;
            } else {
                info.userquit = callerTeleUID;
                info.quitName = userInfo.UserName;
                info.message = "quitcall";
            };
        };
        if (message === "destroy") {
            info.currentUID = callerTeleUID;
        };
        if (message === "issue") {
            info.noissue = receiverTeleUID;
            info.issue = callerTeleUID;
            info.issueName = userInfo.UserName;
        };
        if (message === "cancel") {
            info.cancel = callerTeleUID;
            info.cancelName = userInfo.UserName;
        };
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(data) {
            console.log("send call", data);
            window.close();
        });
    };

    $scope.loadListDoctor();

    $scope.addDoctor = function(doctor) {
        console.log("doctor.UserAccount", doctor);
        try {
            if ($scope.streams.length < 2) {
                console.log("add call");
                var info = {
                    message: "call",
                    sessionId: sessionId,
                    callerInfo: userInfo,
                    callName: $scope.callName,
                    receiverInfo: doctor.UserAccount,
                    streamLength: $scope.streams.length,
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
            console.log("$scope.addDoctor ", err);
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
    };

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
    };

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
