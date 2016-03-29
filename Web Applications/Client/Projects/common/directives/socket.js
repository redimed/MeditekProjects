var ioSocket = {},
    socketAuth = ioSocket.Auth,
    socketRest = ioSocket.Rest,
    socketTelehealth = ioSocket.Telehealth,
    socketNc = ioSocket.Nc;


socketMakeRequest = function(server, api, obj) {
    server.get(api, obj, function(data, jwres) {
        console.log('=============Socket===============', api);
        console.log(data);
    });
}




/*begin socket 3006 */
socketAuth = io.sails.connect(o.const.authBaseUrl);
socketAuth.on('connect', function() {
    connectedAuth();
    console.log("auth connect socket");
    if (ioSocket.authConnect) {
        ioSocket.authConnect();
    }
});
socketAuth.on('testmessage', function(msg) {
    console.log(JSON.stringify("a" + msg));
});
/* end socket 3006 */





/* begin socket 3005 */
function connectedAuth() {
    //====connect 3009
    socketRest = io.sails.connect(o.const.restBaseUrl);
    socketRest.on('connect', function() {
        connectedTelehealth();
        console.log("rest connect socket");
    });
    socketRest.on('testmessage', function(msg) {
        console.log(JSON.stringify("b" + msg));
    })
}
/* begin socket 3005 */




/* begin socket 3009 */
function connectedTelehealth() {
    //====connect 3016
    socketTelehealth = io.sails.connect(o.const.telehealthBaseURL);
    socketTelehealth.on('connect', function() {
        connectedNc();
        console.log("telehealth connect socket");
        if (ioSocket.telehealthConnect) {
            ioSocket.telehealthConnect();
        }
    });
    socketTelehealth.on('testmessage', function(msg) {
        console.log(JSON.stringify("d" + msg));
    });

    socketTelehealth.on('receiveMessage', function(msg) {
        switch (msg.message) {
            case "decline":
                ioSocket.telehealthDecline(msg);
                break;
            case "call":
                ioSocket.telehealthCall(msg);
                break;
            case "cancel":
                ioSocket.telehealthCancel(msg);
                break;
            case "misscall":
                ioSocket.telehealthMisscall(msg);
                break;
        };
    });
}
/* begin socket 3009 */




/* begin socket 3016 */
function connectedNc() {
    socketNc = io.sails.connect(o.const.ncBaseUrl);
    socketNc.on('connect', function() {
        console.log("notification center connect socket");
    });
    socketNc.on('testmessage', function(msg) {
        console.log(JSON.stringify(msg));
    });
}
/* begin socket 3016 */
