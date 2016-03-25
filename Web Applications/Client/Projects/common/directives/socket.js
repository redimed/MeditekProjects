var socketAuth = {},
    socketRest = {},
    socketNc = {},
    socketTelehealth = {};


/*begin socket 3006 */
socketAuth = io.sails.connect(o.const.authBaseUrl);
socketAuth.on('connect', function() {
    socketAuth.funConnect = new Promise(function(resolve, reject) {
        resolve("auth connect socket");
    }).then(function(value) {
        console.log(value);
        connectedAuth();
    });
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
        socketRest.funConnect = new Promise(function(resolve, reject) {
            resolve("rest connect socket");
        }).then(function(value) {
            console.log(value);
            connectedTelehealth();
        });
    });
    socketRest.on('testmessage', function(msg) {
        console.log(JSON.stringify("b" + msg));
    })
}
/* begin socket 3005 */


/* begin socket 3009 */
function connectedTelehealth() {
    socketTelehealth = io.sails.connect(o.const.telehealthBaseURL);
    socketTelehealth.on('connect', function() {
        console.log("telehealth connect socket");
        //====connect 3016
        connectNc();
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
function connectNc() {
    socketNc = io.sails.connect(o.const.ncBaseUrl);
    socketNc.on('connect', function() {
        console.log('notification center connect socket');
    });
    socketNc.on('testmessage', function(msg) {
        console.log(JSON.stringify(msg));
    });
}
/* begin socket 3016 */
