var config = sails.config.myconf;
//======== Initialize Opentok module ==========
var $q = require('q');
var OpenTok = require('opentok'),
    opentok = new OpenTok(config.OpentokAPIKey, config.OpentokAPISecret);
var arrTemp = [];

function emitError(socket, msg) {
    var err = new Error("Socket.Error");
    err.pushError(msg);
    sails.sockets.emit(socket, 'errorMsg', ErrorWrap(err))
};

function pushGCMNotification(info, devices) {
    var androidMess = {
        collapseKey: 'REDiMED',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data: info.data ? info.data : {},
        notification: {
            title: "REDiMED",
            icon: "ic_launcher",
            body: info.content ? info.content : 'Push Notification From REDiMED'
        }
    };
    TelehealthService.SendGCMPush(androidMess, devices).then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err);
    })
};

function pushAPNNotification(info, devices) {
    var iosMess = {
        badge: 1,
        alert: info.content ? info.content : 'Push Notification From REDiMED',
        payload: info.data ? info.data : {},
        category: info.category ? info.category : null
    };
    TelehealthService.SendAPNPush(iosMess, devices);
};
module.exports = {
    JoinConferenceRoom: function(req, res) {
        console.log("aaaaaaa", req.param('uid'), req.isSocket);
        if (!req.isSocket) {
            var err = new Error("Socket.JoinConferenceRoom.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        var uid = req.param('uid');
        var error = null;
        if (uid) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                if (teleUser) {
                    sails.sockets.join(req.socket, uid);
                    sails.sockets.leave(req.socket, req.socket.id);
                    console.log("JoinConferenceRoom Successfully", uid);
                    if (_.some(arrTemp, {
                            to: uid
                        })) {
                        var index = _.findIndex(arrTemp, {
                            to: uid,
                            message: 'call'
                        });
                        sails.sockets.emit(req.socket.id, '-', arrTemp[index]);
                    }
                } else error = "User Is Not Exist";
            }).catch(function(err) {
                error = err;
            })
        } else error = "Invalid Params";
        if (error) emitError(req.socket, error);
    },
    MessageTransfer: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.MessageTransfer.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        sails.log.debug("Socket MessageTransfer: " + JSON.stringify(req.params.all()));
        var from = req.param('from');
        var to = req.param('to');
        var message = req.param('message');
        var data = {};
        if (!message || !from || !to) return;
        var fromName = req.param('fromName');
        var sessionId = null;
        var tokenOptions = {
            role: 'moderator'
        };
        var token = null;
        var roomList = sails.sockets.rooms();
        if (message.toLowerCase() == 'call') {
            sessionId = req.param('sessionId');
            if (!sessionId) return;
            token = opentok.generateToken(sessionId, tokenOptions);
            data.apiKey = config.OpentokAPIKey;
            data.sessionId = sessionId;
            data.token = token;
            data.fromName = !fromName ? 'Unknown' : fromName;
            var pushInfo = {
                data: {
                    "data": {
                        "apiKey": config.OpentokAPIKey,
                        "message": message,
                        "fromName": (!fromName ? 'Unknown' : fromName),
                        "sessionId": sessionId,
                        "token": token,
                        "from": from
                    }
                },
                content: 'Calling From ' + (!fromName ? 'Unknown' : fromName),
                category: 'CALLING_MESSAGE'
            };
            TelehealthService.FindByUID(to).then(function(teleUser) {
                if (teleUser) {
                    TelehealthDevice.findAll({
                        where: {
                            TelehealthUserID: teleUser.ID
                        }
                    }).then(function(devices) {
                        var iosDevices = [];
                        var androidDevices = [];
                        if (devices) {
                            for (var i = 0; i < devices.length; i++) {
                                if (devices[i].Type == 'IOS') iosDevices.push(devices[i].DeviceToken);
                                else androidDevices.push(devices[i].DeviceToken);
                            }
                            if (androidDevices.length > 0) pushGCMNotification(pushInfo, androidDevices);
                            if (iosDevices.length > 0) pushAPNNotification(pushInfo, iosDevices);
                        }
                    })
                }
            })
        }
        if (roomList.length > 0) {
            data.from = from;
            data.message = message;
            data.to = to;
            var index = _.findIndex(arrTemp, {
                to: to
            });
            if (message.toLowerCase() == 'call' && index == -1) arrTemp.push(data);
            else arrTemp.splice(index, 1);
            console.log(roomList);
            console.log(to);
            console.log("8888888888888888888888888888", _.contains(roomList, to));
            if (_.contains(roomList, to)) {
                console.log("0000000000000000000000000000000000000000", data);
                sails.sockets.broadcast(to, 'receiveMessage', data);
            }
            console.log("8888888888888888888888888888", sails.sockets.subscribers(from).length);
            if (sails.sockets.subscribers(from).length > 1 && message.toLowerCase() != 'call') {
                data.message = 'decline';
                data.to = from;
                console.log("333333333333333333333333333333333", data);
                sails.sockets.broadcast(from, 'receiveMessage', data, req.socket);
            }
        }
    },
    GenerateConferenceSession: function(req, res) {
        console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
        opentok.createSession({
            mediaMode: "routed"
        }, function(err, session) {
            if (err) return res.serverError(ErrorWrap(err));
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
            var sessionId = session.sessionId;
            var tokenOptions = {
                role: 'moderator',
                expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
                data: 'name=Johnny'
            };
            var token = opentok.generateToken(sessionId, tokenOptions);
            if (token != null && sessionId != null) res.ok({
                message: 'Generate Session Successfully!',
                data: {
                    apiKey: config.OpentokAPIKey,
                    sessionId: sessionId,
                    token: token
                }
            })
        });
    }
}
