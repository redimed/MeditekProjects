var socketAuth = {},
    socketRest = {},
    socketNc = {},
    socketTelehealth = {};

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
    if (socketAuth.funConnect) {
        socketAuth.funConnect();
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
        if (socketTelehealth.funConnect) {
            socketTelehealth.funConnect();
        }
    });
    socketTelehealth.on('testmessage', function(msg) {
        console.log(JSON.stringify("d" + msg));
    });

    socketTelehealth.on('receiveMessage', function(msg) {
        switch (msg.message) {
            case "decline":
                socketTelehealth.funDecline(msg);
                break;
            case "call":
                socketTelehealth.funCall(msg);
                break;
            case "cancel":
                socketTelehealth.funCancel(msg);
                break;
            case "misscall":
                socketTelehealth.funMisscall(msg);
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
