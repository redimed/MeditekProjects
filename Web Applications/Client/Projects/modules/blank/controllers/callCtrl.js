var app = angular.module('app.blank.call.controller', []);

app.controller('callCtrl', function($scope, $stateParams, $timeout, $cookies, AuthenticationService, OTSession) {
    var apiKey = $stateParams.apiKey;
    var sessionId = $stateParams.sessionId;
    var token = $stateParams.token;
    var uidCall = $stateParams.uidCall;
    var uidUser = $stateParams.uidUser;
    var reverse = true;
    $scope.userName = $stateParams.userName;
    session = OT.initSession(apiKey, sessionId);
    var userInfo = $cookies.getObject('userInfo');
    console.log("userInfo", userInfo);
    console.log(apiKey);
    console.log(sessionId);
    console.log(token);
    console.log("$stateParams", $stateParams);
    o.loadingPage(true);
    //Connect to the session
    function sendCall() {
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', {
            from: uidUser,
            to: uidCall,
            message: "call",
            sessionId: sessionId,
            fromName: userInfo.UserName
        }, function(data) {
            console.log("send call", data);
        });
        o.audio.loop = true;
        o.audio.play();
    };

    console.log("apiKey, sessionId, token");
    console.log(apiKey);
    console.log(sessionId);
    console.log(token);

    OTSession.init(apiKey, sessionId, token, function(err) {
        if (!err) {
            if (!_.isEmpty(socketTelehealth)) {
                sendCall();
            } else {
                ioSocket.telehealthConnect = function() {
                    sendCall();
                }
            }

        }else{
            console.log(err);
        }
    });

    $scope.streams = OTSession.streams;

    $scope.$on("otStreamCreated", function(event, args) {
        o.audio.pause();
        var mytimeout = $timeout($scope.onTimeout, 1000);
    });

    $scope.$on("changeSize", function(event, stream) {
        if (stream.oth_large === undefined) {
            stream.oth_large = stream.name !== "screen";
        } else {
            if (stream.oth_large === false) {
                for (var i = 0; i < $scope.streams.length; i++) {
                    if ($scope.streams[i] === stream) {
                        $scope.streams[i].oth_large = !stream.oth_large;
                        console.log("========== ", $scope.streams[i].oth_large);
                    }
                }
                if (reverse) {
                    $scope.streams.slice().reverse();
                } else {
                    reverse = true;
                }
            } else {
                for (var i = 0; i < $scope.streams.length; i++) {
                    if ($scope.streams[i] != stream) {
                        $scope.streams[i].oth_large = !stream.oth_large;
                        console.log("========== ", $scope.streams[i].oth_large);
                    }
                }
                if ($scope.streams[0] === stream) {
                    reverse = false;
                }
            }
        }
        setTimeout(function() {
            event.targetScope.$emit("otLayout");
        }, 10);
    });

    // session.connect(token, function(error) {
    //     // If the connection is successful, initialize a publisher and publish to the session
    //     if (!error) {
    //         var publisherOptions = { insertMode: 'append', publishAudio: true, publishVideo: true, audioVolume: 100 };
    //         $scope.publisher = OT.initPublisher('publisher', publisherOptions, function(error) {
    //             if (!error) {
    //                 console.log("publish Success");
    //                 console.log("calllllllllllllllllllllllllllllllllll", _.isEmpty(socketTelehealth));
    //                 if (!_.isEmpty(socketTelehealth)) {
    //                     sendCall();
    //                 } else {
    //                     ioSocket.telehealthConnect = function() {
    //                         console.log("aaaaaaaaaaaaaaa");
    //                         sendCall();
    //                     }
    //                 }
    //             } else {
    //                 console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", error);
    //             }
    //         });
    //         session.publish($scope.publisher);
    //     } else {
    //         console.log('There was an error connecting to the session: ', error.code, error.message);
    //     }
    // });

    // // Subscribe to a newly created stream
    // session.on('streamCreated', function(event) {
    //     var stream = event.stream;
    //     displayStream(stream);
    //     o.loadingPage(false);
    // });

    // function displayStream(stream) {
    //     o.audio.pause();
    //     var subscriberOptions = { insertMode: 'append', width: '100%', height: '100%', subscribeToAudio: true, subscribeToVideo: true, audioVolume: 100 };
    //     $scope.subscriber = session.subscribe(stream, 'subscriber', subscriberOptions);
    //     var mytimeout = $timeout($scope.onTimeout, 1000);
    // }

    //disconect
    session.on('sessionDisconnected', function(event) {
        console.log('You were disconnected from the session.', event.reason);
        if ($scope.streams.length < 1) {
            window.close();
        }
    });

    session.on('connectionDestroyed', function() {
        console.log("connectionDestroyed ", $scope.streams.length);
        if ($scope.streams.length < 1) {
            window.close();
        }
    });

    session.on('streamDestroyed', function(event) {
        // console.log("streamDestroyed", event.reason);
        // console.log("streamDestroyed ", $scope.streams.length);
        if ($scope.streams.length < 1) {
            window.close();
        }
    });

    session.on("signal:endCall", function(event) {
        console.log("Signal sent from connection ", event);
        if ($scope.streams.length < 1) {
            window.close();
        }
    });

    $scope.counter = 0;

    $scope.onTimeout = function() {
        $scope.counter++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.EnAudio = function() {
        $scope.subscriber.subscribeToAudio(false)
    };

    $scope.EndCall = function() {
        if ($scope.streams.length <= 1) {
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
        } else {
            window.close();
        }
    };

    $scope.cancel = function() {
        console.log("socketTelehealth", socketTelehealth);
        socketTelehealth.get('/api/telehealth/socket/messageTransfer', {
            from: uidUser,
            to: uidCall,
            message: "cancel"
        }, function(data) {
            console.log("send call", data);
            window.close();
        });
        window.close();
    };


    $scope.toggle = false;
    $scope.zoom = false;
    $scope.size = '900px';
    $scope.src = 'E-call_10.png';
    $scope.listUser = function() {
        $scope.toggle = $scope.toggle === true ? false : true;
    };
    $scope.ZoomScreen = function(size) {
        angular.element(".my-skype").attr("style", "width:" + size);
        $scope.src = $scope.src === 'E-call_10.png' ? 'E-call_09.png' : 'E-call_10.png';
        $scope.size = $scope.size === '100%' ? '900px' : '100%';
        $scope.zoom = $scope.zoom === false ? true : false;
    };

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

    $scope.addDoctor = function(doctor) {
        if ($scope.streams.length < 2) {
            socketTelehealth.get('/api/telehealth/socket/addDoctor', {
                from: uidUser,
                to: doctor.UserAccount.TelehealthUser.UID,
                message: "add",
                sessionId: sessionId,
                apiKey: apiKey,
                fromName: userInfo.UserName
            }, function(data) {
                console.log("send call", data);
                window.close();
            });
        } else {
            swal("Cann't Call", "You can not call more than 3 people!");
        }
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
