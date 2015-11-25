var config = sails.config.myconf;
//======== Initialize Opentok module ==========
var $q = require('q');
var OpenTok = require('opentok'),
    opentok = new OpenTok(config.OpentokAPIKey, config.OpentokAPISecret);
module.exports = {
    JoinConferenceRoom: function(req, res) {
        if (!req.isSocket) {
            res.json(500, {
                status: 'error',
                message: 'Socket Request Only!'
            });
            return;
        }
        var uid = req.param('uid');
        if (uid) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                if (teleUser) {
                    sails.sockets.join(req.socket, uid);
                    sails.sockets.leave(req.socket, req.socket.id);
                    sails.sockets.blast('onlineUser');
                } else {
                    sails.sockets.emit(req.socket, 'errorMsg', {
                        msg: 'User Not Exist!'
                    });
                }
            }).catch(function(err) {
                sails.sockets.emit(req.socket, 'errorMsg', {
                    msg: err
                });
            })
        } else {
            sails.sockets.emit(req.socket, 'errorMsg', {
                msg: 'Invalid Parameters!'
            });
        }
    },
    MessageTransfer: function(req, res) {
        if (!req.isSocket) {
            res.json(500, {
                status: 'error',
                message: 'Socket Request Only!'
            });
            return;
        }
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

        if (message.toLowerCase() == 'call') {
            sessionId = req.param('sessionId');
            if (!sessionId) return;
            token = opentok.generateToken(sessionId, tokenOptions);
            var iosMess = {
                badge: 1,
                alert: 'Calling From ' + (!fromName ? 'Unknown' : fromName),
                payload: {
                    "data": {
                        "apiKey": config.OpentokAPIKey,
                        "message": message,
                        "fromName": (!fromName ? 'Unknown' : fromName),
                        "sessionId": sessionId,
                        "token": token,
                        "from": from
                    }
                },
                category: "CALLING_MESSAGE"
            };
            var androidMess = {
                collapseKey: 'REDiMED',
                priority: 'high',
                contentAvailable: true,
                delayWhileIdle: true,
                timeToLive: 3,
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
                notification: {
                    title: "REDiMED",
                    icon: "ic_launcher",
                    body: 'Calling From ' + (!fromName ? 'Unknown' : fromName)
                }
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
                            if (iosDevices.length > 0) TelehealthService.SendAPNPush(iosMess, iosDevices);
                            if (androidDevices.length > 0) {
                                TelehealthService.SendGCMPush(androidMess, androidDevices).then(function(result) {
                                    console.log(result);
                                }).catch(function(err) {
                                    console.log(err);
                                })
                            }
                        }
                    })
                }
            })
        }
        
        var roomList = sails.sockets.rooms();
        if (roomList.length > 0) {
            for (var i = 0; i < roomList.length; i++) {
                if (roomList[i] == to) {
                    data.from = from;
                    data.message = message;
                    if (message.toLowerCase() == 'call') {
                        data.apiKey = config.OpentokAPIKey;
                        data.sessionId = sessionId;
                        data.token = token;
                        data.fromName = !fromName ? 'Unknown' : fromName;
                    }
                    sails.sockets.broadcast(roomList[i], 'receiveMessage', data);
                }
            }
        }
    },
    GenerateConferenceSession: function(req, res) {
        opentok.createSession({
            mediaMode: "routed"
        }, function(err, session) {
            if (err) {
                res.json(500, {
                    status: 'error',
                    message: err
                });
                return;
            }
            var sessionId = session.sessionId;
            var tokenOptions = {
                role: 'moderator',
                // expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60),
                // data :'name=Johnny'
            };
            var token = opentok.generateToken(sessionId, tokenOptions);
            if (token != null && sessionId != null) res.json(200, {
                status: 'success',
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