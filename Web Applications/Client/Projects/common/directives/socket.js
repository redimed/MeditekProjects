var ioSocket = {
    Auth: null,
    Rest: null,
    Telehealth: null,
    Nc: {
        socket: null,
        function: {}
    }
};
var socketAuth = ioSocket.Auth;
var socketRest = ioSocket.Rest;
var socketTelehealth = ioSocket.Telehealth;
var socketNc = ioSocket.Nc.socket;
var socketNcFunction = ioSocket.Nc.function;
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

messageTransfer = function(from, to, message) {
    socketTelehealth.get('/api/telehealth/socket/messageTransfer', {
        from: from,
        to: to,
        message: message
    }, function(data) {
        console.log("send call", data);
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
    var msgContent = JSON.parse(msg);
    console.log('notification', msgContent);

});

socketAuth.on('globalnotify', function(msg) {
    var msgContent = JSON.parse(msg);
    console.log("|||||| globalnotify", msg);
    switch (msgContent.Command.Note) {
        case "NotifyMessage":
            if (socketNcFunction.LoadGlobalNotify) {
                socketNcFunction.LoadGlobalNotify(msgContent);
            };
            if (socketNcFunction.LoadListGlobalNotify) {
                socketNcFunction.LoadListGlobalNotify();
            };
            break;
        case "CreateAppointment":
        case "LinkPatient":
            console.log("socketNcFunction", socketNcFunction);
            if (socketNcFunction.LoadGlobalNotify) {
                socketNcFunction.LoadGlobalNotify(msgContent);
            };
            if (socketNcFunction.LoadListAppointment) {
                socketNcFunction.LoadListAppointment();
            };
            if (socketNcFunction.LoadListGlobal) {
                socketNcFunction.LoadListGlobal();
            };
            break;
        default:
            break;
    };
});

socketAuth.on('privatenotify', function(msg) {
    var msgContent = JSON.parse(msg);
    switch (msgContent.Command.Note) {
        case "NotifyMessage":
            if (socketNcFunction.LoadPrivateNotify) {
                socketNcFunction.LoadPrivateNotify(msgContent);
            };
            if (socketNcFunction.LoadListPrivate) {
                socketNcFunction.LoadListPrivate();
            };
            break;
        case "TodoMessage":
            if (socketNcFunction.LoadTodoNotify) {
                socketNcFunction.LoadTodoNotify(msgContent);
            };
            if (socketNcFunction.LoadListPrivate) {
                socketNcFunction.LoadListPrivate();
            };
            break;
        case "RequestMessage":
            if (socketNcFunction.LoadRequestNotify) {
                socketNcFunction.LoadRequestNotify(msgContent);
            };
            if (socketNcFunction.LoadListPrivate) {
                socketNcFunction.LoadListPrivate();
            };
            break;
        case "ReviewMessage":
            if (socketNcFunction.LoadReviewNotify) {
                socketNcFunction.LoadReviewNotify(msgContent);
            };
            if (socketNcFunction.LoadListPrivate) {
                socketNcFunction.LoadListPrivate();
            };
            break;
        case "CreateAppointment":
        case "LinkPatient":
            if (socketNcFunction.LoadListAppointment) {
                socketNcFunction.LoadListAppointment();
            };
            if (socketNcFunction.LoadPrivateNotify) {
                socketNcFunction.LoadPrivateNotify(msgContent);
            };
            if (socketNcFunction.LoadListPrivate) {
                socketNcFunction.LoadListPrivate();
            };
            break;
        default:
            break;
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



/* begin socket 3009 */
function createSocketConnectTelehealth() {
    //====connect 3016
    socketTelehealth = io.sails.connect(o.const.telehealthBaseURL);
    socketTelehealth.on('connect', function() {
        createSocketConnectNC();
        console.log("telehealth connect socket");
        if (ioSocket.telehealthConnect) {
            ioSocket.telehealthConnect();
        }
    });
    socketTelehealth.on('testmessage', function(msg) {
        console.log(JSON.stringify("d" + msg));
    });

    // socketTelehealth.on('disconnect', function() {
    //     console.log("disconnect");
    //     socketTelehealth = io.socket.delete(o.const.telehealthBaseURL);
    // });

    socketTelehealth.on('receiveMessage', function(msg) {
        switch (msg.message) {
            case "decline":
                if (ioSocket.telehealthDecline)
                    ioSocket.telehealthDecline(msg);
                else
                    ioSocket.telehealthMesageDecline = msg;
                break;
            case "call":
                if (ioSocket.telehealthCall)
                    ioSocket.telehealthCall(msg);
                else
                    ioSocket.telehealthMesageCall = msg;
                break;
            case "cancel":
                if (ioSocket.telehealthCancel)
                    ioSocket.telehealthCancel(msg);
                else
                    ioSocket.telehealthMesageCancel = msg;
                break;
            case "misscall":
                if (ioSocket.telehealthMisscall)
                    ioSocket.telehealthMisscall(msg);
                else
                    ioSocket.telehealthMesageMisscall = msg;
                break;
            case "addDoctor":
                if (ioSocket.telehealthCall)
                    ioSocket.telehealthCall(msg);
                break;
        };
    });
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
