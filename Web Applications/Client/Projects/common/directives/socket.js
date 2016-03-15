var socketAuth, socketRest, socketNc, socketTelehealth = {}
    //socket 3006
socketAuth = io.sails.connect(o.const.authBaseUrl);
socketAuth.on('connect', function() {
    console.log("auth connect socket");

    //socket 3005
    socketRest = io.sails.connect(o.const.restBaseUrl);
    socketRest.on('connect', function() {
        console.log('rest connect socket');

        //socket 3009
        socketTelehealth = io.sails.connect(o.const.telehealthBaseURL);
        socketTelehealth.on('connect', function() {
            console.log("telehealth connect socket");
            if (socketTelehealth.funConnect) {
                socketTelehealth.funConnect();
            }
            //socket 3016
            socketNc = io.sails.connect(o.const.ncBaseUrl);
            socketNc.on('connect', function() {
                console.log('notification center connect socket');
            });
            socketNc.on('testmessage', function(msg) {
                console.log(JSON.stringify(msg));
            });
        })
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
    })
    socketRest.on('testmessage', function(msg) {
        console.log(JSON.stringify("b" + msg));
    })

})

socketAuth.on('testmessage', function(msg) {
    console.log(JSON.stringify("a" + msg));
});
