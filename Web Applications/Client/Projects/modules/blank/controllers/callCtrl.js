var app = angular.module('app.blank.call.controller', []);

app.controller('callCtrl', function($scope, $stateParams, $timeout) {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        // Request the camera.
        navigator.getUserMedia(
            // Constraints
            {
                video: true,
                audio: true
            },

            // Success Callback
            function(localMediaStream) {
                console.log("camera support");
            },

            // Error Callback
            function(err) {
                // Log the error to the console.
                console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );
    } else {
        alert('Sorry, your browser does not support getUserMedia');
    }

    var apiKey = $stateParams.apiKey;
    var sessionId = $stateParams.sessionId;
    var token = $stateParams.token;
    var uidCall = $stateParams.uidCall;
    var uidUser = $stateParams.uidUser;
    $scope.userName = $stateParams.userName;
    OT.registerScreenSharingExtension('chrome', 'pkakgggplhfilfbailbaibljfpalofjn');
    $scope.session = OT.initSession(apiKey, sessionId);
    console.log(apiKey);
    console.log(sessionId);
    console.log(token);
    console.log("$stateParams",$stateParams);
    o.loadingPage(true);
    //Connect to the session
    $scope.session.connect(token, function(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            $scope.publisher = OT.initPublisher('publisher', {
                insertMode: 'append',
                width: '100%',
                height: '100%',
                publishAudio: true,
                publishVideo: true,
                audioVolume: 100
            });

            $scope.session.publish(publisher);
            console.log("connect", $scope.session);
        } else {
            console.log('There was an error connecting to the session: ', error.code, error.message);
        }
    });

    // Subscribe to a newly created stream
    $scope.session.on('streamCreated', function(event) {
        o.loadingPage(false);
        $scope.subscriber = $scope.session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            subscribeToAudio: true,
            subscribeToVideo: true,
            audioVolume: 100
        });
        console.log("streamCreated", $scope.subscriber);
        var mytimeout = $timeout($scope.onTimeout, 1000);
    });


    //disconect
    $scope.session.on('sessionDisconnected', function(event) {
        console.log('You were disconnected from the session.', event.reason);
        window.close();
    });

    $scope.session.on('connectionDestroyed', function() {
        console.log("connectionDestroyed");
        window.close();
    })

    $scope.session.on('streamDestroyed', function() {
        console.log("streamDestroyed");
        window.close();
    })

    $scope.session.on("signal:endCall", function(event) {
        console.log("Signal sent from connection ", event);
        window.close();
        // Process the event.data property, if there is any data.
    });


    $scope.counter = 0;

    $scope.onTimeout = function() {
        $scope.counter++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.aaa = function() {
        $scope.subscriber.subscribeToAudio(false)
    };

    $scope.bbb = function() {
        $scope.session.signal({
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
        $scope.session.disconnect();
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
    }

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
