var ioSocket = {
    Auth: null,
    Rest: null,
    Telehealth: null,
    Nc: null
};
var socketAuth = ioSocket.Auth;
var socketRest = ioSocket.Rest;
var socketTelehealth = ioSocket.Telehealth;
var socketNc = ioSocket.Nc;
socketJoinRoom = function(server, api, obj) {
    server.request({
        method: 'get',
        url: api,
        headers: {
            systemtype: "WEB"
        },
        data: obj
    }, function(data, jwres) {
        console.log('=============Socket===============', api);
        console.log(data);
    });
}

messageTransfer = function(caller, receiver, message, receiverName, teleCallUID, data) {
    var info = {
        callerTeleUID: caller,
        receiverTeleUID: receiver,
        message: message,
        receiverName: receiverName,
        teleCallUID: teleCallUID,
    };
    if (message === "waiting") {
        info.callerInfo = data;
    }
    socketTelehealth.get('/api/telehealth/socket/messageTransfer', info, function(msg) {
        console.log("send call", msg);
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*begin socket 3006 */
socketAuth = io.sails.connect(o.const.authBaseUrl);
socketAuth.on('connect', function() {
    console.log("auth connect socket");
    // if (ioSocket.socketAuthReconnect) {
    //     ioSocket.socketAuthReconnect();
    // };
    if (getCookie("userInfo")) {
        socketJoinRoom(socketAuth, '/api/socket/makeUserOwnRoom', { UID: JSON.parse(decodeURIComponent(getCookie("userInfo"))).UID });
    };
    createSocketConnectRest();
});
socketAuth.on('testmessage', function(msg) {
    console.log(JSON.stringify("aa" + msg));
});
socketAuth.on('UpdateRequestWAAppointmentCompany_DM', function(msg) {
    console.log('UpdateRequestWAAppointmentCompany_DM', msg);
});
socketAuth.on('notification', function(msg) {
    console.log('notification', msg);
    if (ioSocket.telehealthNotify) {
        ioSocket.telehealthNotify(msg);
    };
});
/* end socket 3006 */



/* begin socket 3005 */
function createSocketConnectRest() {
    //====connect 3009
    socketRest = io.sails.connect(o.const.restBaseUrl);
    socketRest.on('connect', function() {
        createSocketConnectTelehealth();
        console.log("rest connect socket");
    });
    socketRest.on('testmessage', function(msg) {
        console.log(JSON.stringify("b" + msg));
    })
    socketRest.on('testaaa', function(msg) {
        console.log("testaaa", msg);
    })
}
/* begin socket 3005 */



var num = 0;
/* begin socket 3009 */
function createSocketConnectTelehealth() {
    //====connect 3016
    if (num === 0) {
        socketTelehealth = io.sails.connect(o.const.telehealthBaseURL);
        socketTelehealth.on('connect', function() {
            createSocketConnectNC();
            console.log("Telehealth connect socket");
            if (getCookie("userInfo")) {
                socketJoinRoom(socketTelehealth, '/api/telehealth/socket/joinRoom', { uid: JSON.parse(decodeURIComponent(getCookie("userInfo"))).TelehealthUser.UID });
            };
        });

        socketTelehealth.on('disconnect', function() {
            console.log("socketTelehealth disconnect");
        });
        // socketTelehealth.on('testmessage', function(msg) {
        //     console.log(JSON.stringify("d" + msg));
        // });

        socketTelehealth.on('receiveMessage', function(msg) {
            switch (msg.message) {
                case "startcall":
                    if (ioSocket.telehealthStartCall) {
                        console.log("receiveMessage startcall");
                        ioSocket.telehealthStartCall(msg);
                    }
                    break;
                case "call":
                    if (ioSocket.telehealthCall) {
                        console.log("receiveMessage call");
                        ioSocket.telehealthCall(msg);
                    }
                    break;
                case "answer":
                    if (ioSocket.telehealthAnswer) {
                        console.log("receiveMessage Answer");
                        ioSocket.telehealthAnswer(msg);
                    }
                    break;
                case "destroy":
                    if (ioSocket.telehealthDestroy) {
                        console.log("receiveMessage Destroy");
                        ioSocket.telehealthDestroy(msg);
                    }
                    break;
                case "issue":
                    if (ioSocket.telehealthIssue) {
                        console.log("receiveMessage issue");
                        ioSocket.telehealthIssue(msg);
                    }
                    break;
                case "waiting":
                    if (ioSocket.telehealthWaiting) {
                        console.log("receiveMessage waiting");
                        ioSocket.telehealthWaiting(msg);
                    }
                    break;
                case "misscall":
                    if (ioSocket.telehealthMisscall) {
                        console.log("receiveMessage misscall");
                        ioSocket.telehealthMisscall(msg.data);
                    }
                    break;
                default:
                    console.log("default");
            };
        });
        num++;
    };
}
/* begin socket 3009 */




/* begin socket 3016 */
function createSocketConnectNC() {
    socketNc = io.sails.connect(o.const.ncBaseUrl);
    socketNc.on('connect', function() {
        console.log("notification center connect socket");
    });
    socketNc.on('testmessage', function(msg) {
        console.log(JSON.stringify(msg));
    });
}
/* begin socket 3016 */
