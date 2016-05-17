var config = sails.config.myconf;
//======== Initialize Opentok module ==========
var $q = require('q');
var _ = require('lodash');
var moment = require('moment');
var OpenTok = require('opentok'),
    opentok = new OpenTok(config.OpentokAPIKey, config.OpentokAPISecret);
var redisKey = "TelehealthServer";

function emitError(socket, msg) {
    var err = new Error("Socket.Error");
    err.pushError(msg);
    sails.sockets.emit(socket, 'errorMsg', ErrorWrap(err))
};

function pushGCMNotification(info, devices, gcmSender) {
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
    TelehealthService.SendGCMPush(androidMess, devices, gcmSender).then(function(result) {
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
        console.log("headers", req.headers);
        console.log("JoinConferenceRoom", req.param('uid'), req.isSocket);
        if (!req.isSocket) {
            var err = new Error("Socket.JoinConferenceRoom.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        var uid = req.param('uid');
        var error = null;
        if (uid) {
            console.log("JoinConferenceRoom vao roi ne");
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                if (teleUser) {
                    sails.sockets.join(req.socket, uid);
                    console.log("roomList", sails.sockets.rooms());
                    sails.sockets.leave(req.socket, req.socket.id);
                    console.log("JoinConferenceRoom Successfully", uid);
                    console.log("roomList", sails.sockets.rooms());
                    RedisWrap.hget(redisKey, uid).then(function(data) {
                        if (data != null) {
                            sails.sockets.broadcast(uid, 'misscall', data);
                            RedisWrap.hdel(redisKey, uid);
                        }
                    });
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
        console.log("MessageTransfer");
        sails.log.debug("Socket MessageTransfer: " + JSON.stringify(req.params.all()));
        var from = req.param('from');
        var to = req.param('to');
        var message = req.param('message');
        if (!message || !from || !to) return;
        var fromName = req.param('fromName');
        var sessionId = null;
        var appid = null;
        var tokenOptions = {
            role: 'moderator'
        };
        var data = {};
        data.from = from;
        data.message = message;
        data.to = to;
        data.timeCall = new Date();
        var token = null;
        var roomList = sails.sockets.rooms();
        if (message.toLowerCase() == 'call') {
            sessionId = req.param('sessionId');
            //appid = req.param("")
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
                        var tokens = [];
                        if (devices) {
                            for (var i = 0; i < devices.length; i++) {
                                if (devices[i].Appid == config.WorkinjuryAppid) {
                                    console.log("WorkinjuryAppid",devices[i].DeviceToken);
                                    if (devices[i].DeviceToken != null)
                                        tokens.push(devices[i].DeviceToken);
                                } else {
                                    console.log("TelehealthAppid",devices[i].DeviceToken);
                                    if (devices[i].DeviceToken != null) {
                                        if (devices[i].Type == 'IOS')
                                            iosDevices.push(devices[i].DeviceToken);
                                        else
                                            androidDevices.push(devices[i].DeviceToken);
                                    }
                                }
                            }
                            if (androidDevices.length > 0)
                                pushGCMNotification(pushInfo, androidDevices, config.GCMTelehealth);
                            if (iosDevices.length > 0)
                                pushAPNNotification(pushInfo, iosDevices);
                            if (tokens.length >0)
                                pushGCMNotification(pushInfo, tokens, config.GCMWorkInjury);
                        }
                    })
                    if (_.contains(roomList, to)) {
                        sails.sockets.broadcast(to, 'receiveMessage', data);
                    }
                }
            })
        }
        if (roomList.length > 0) {
            // When receiver choose answer message call
            if (message.toLowerCase() === 'answer') {
                console.log();
            };
            // When receiver choose cancel message call
            if (message.toLowerCase() === 'decline') {
                sails.sockets.broadcast(from, 'receiveMessage', data);
            };
            // When caller or receiver choose endcall in window waiting
            if (message.toLowerCase() === 'cancel') {
                sails.sockets.broadcast(to, 'receiveMessage', data);
            };
            // When device caller or receiver issue
            if (message.toLowerCase() === 'issue') {
                var isissue = req.param('isissue');
                sails.sockets.broadcast(isissue, 'receiveMessage', data);
            };
            // When receiver without
            if (message.toLowerCase() === 'waiting') {
                sails.sockets.broadcast(from, 'receiveMessage', data);

                var CallerInfo = req.param('CallerInfo');

                RedisWrap.hget(redisKey, to).then(function(data) {
                    if (data != null) {
                        CallerInfo.TimeCall = new Date();
                        data.push(CallerInfo);
                        RedisWrap.hset(redisKey, to, data);
                    } else {
                        var MissCaller = [];
                        CallerInfo.TimeCall = new Date();
                        MissCaller.push(CallerInfo);
                        RedisWrap.hset(redisKey, to, MissCaller);
                    }
                });

                console.log("waiting ", data);
            };
        };
    },

    // No working
    GenerateConferenceSession: function(req, res) {
        console.log("-----------------------------------------------");
        opentok.createSession({
            mediaMode: "routed"
        }, function(err, session) {
            if (err) return res.serverError(ErrorWrap(err));
            var sessionId = session.sessionId;
            var tokenOptions = {
                role: 'moderator',
                expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
                data: 'name=Johnny'
            };
            var token = opentok.generateToken(sessionId, tokenOptions);
            console.log("Generate Session Successfully");
            if (token != null && sessionId != null) res.ok({
                message: 'Generate Session Successfully!',
                data: {
                    apiKey: config.OpentokAPIKey,
                    sessionId: sessionId,
                    token: token
                }
            })
        });
    },
    ListRoomSocket: function(req, res) {
        var roomList = sails.sockets.rooms();
        console.log("roomList", roomList);
        res.ok({ roomList: roomList });
    },
    TotalUserInRoom: function(req, res) {
        var roomId = req.body.UID;
        var userInRoom = sails.sockets.subscribers(roomId);
        var toal = sails.sockets.subscribers(roomId).length;
        console.log("userInRoom", userInRoom);
        res.ok({ userInRoom: userInRoom, toal: toal });
    },
    Logout: function(req, res) {
        console.log("aaaaaaa", req.param('uid'), req.isSocket);
        console.log("headers", req.headers.systemtype);
        var err = new Error("Socket.Logout.Error");
        if (!req.isSocket) {
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }

        var uid = req.param('uid');
        if (req.headers.systemtype === "WEB") {
            sails.sockets.leave(req.socket, uid);
            console.log("roomList", sails.sockets.rooms());
            return res.ok({
                status: "success"
            });
        }

        /*request header*/
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;

        /*push param */
        // var deviceId = req.param('deviceid');
        // var deviceType = req.param('systemtype');
        var roomList = sails.sockets.rooms();
        if (uid && deviceType && deviceId) {
            return TelehealthService.FindByUID(uid).then(function(teleUser) {
                return TelehealthDevice.update({
                    DeviceToken: null
                }, {
                    where: {
                        TelehealthUserID: teleUser.ID,
                        DeviceID: deviceId,
                        Type: deviceType
                    }
                }).then(function(result) {
                    sails.sockets.leave(req.socket, uid);
                    return res.ok({
                        status: "success"
                    });
                }, function(error) {
                    err.pushError("Update Telehealth Device Error");
                    return res.serverError(ErrorWrap(error));
                });
            })
        } else {
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    AddDoctor: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.AddDoctor.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        };

        var data = {};
        var sessionId = req.body.sessionId;
        var tokenOptions = {
            role: 'moderator'
        };
        var token;
        var fromName = req.body.fromName;
        var from = req.body.from;
        token = opentok.generateToken(sessionId, tokenOptions);
        data.apiKey = req.body.apiKey;
        data.sessionId = sessionId;
        data.token = token;
        data.fromName = !fromName ? 'Unknown' : fromName;

        var to = req.body.to;
        if (_.indexOf(sails.sockets.rooms(), to) != -1) {
            data.message = 'addDoctor';
            console.log(">>>>>>>>>>>>>>>>> Online <<<<<<<<<<<<<<");
            sails.sockets.broadcast(to, 'receiveMessage', data);
        } else {
            data.message = 'offline';
            console.log(">>>>>>>>>>>>>>>>> Offline <<<<<<<<<<<<<<");
            sails.sockets.broadcast(from, 'receiveMessage', data);
        }
    },
    CallToReceiver: function(req, res) {
        var info = req.param('info');
        var ReceiverName = info.ReceiverName;
        var ReceiverTeleUID = info.ReceiverTeleUID;
        var ReceiverTeleID = info.ReceiverTeleID;
        var ReceiverID = info.ReceiverID;
        var CallerInfo = info.CallerInfo;
        var CallerID = CallerInfo.ID;
        var CallerTeleID = CallerInfo.TelehealthUser.ID;
        console.log("Call To Receiver ", info);
        var InfoCall = {
            FromUserAccountID: CallerID,
            ToUserAccountID: ReceiverID
        };
        TelehealthService.FindByUID(ReceiverTeleUID).then(function(teleUser) {
            if (teleUser) {
                TelehealthDevice.findAll({
                    where: {
                        TelehealthUserID: teleUser.ID
                    }
                }).then(function(devices) {
                    console.log("Call To Receiver ", teleUser.Status1);
                    var iosDevices = [];
                    var androidDevices = [];
                    if (devices) {
                        console.log("Call To Receiver", devices);
                        for (var i = 0; i < devices.length; i++) {
                            if (devices[i].DeviceToken != null) {
                                console.log("Pushhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", devices[i].DeviceToken);
                                if (devices[i].Type == 'IOS')
                                    iosDevices.push(devices[i].DeviceToken);
                                else
                                    androidDevices.push(devices[i].DeviceToken);
                            }
                        }
                    }
                    if (iosDevices.length === 0 && androidDevices.length === 0) {
                        if (teleUser.Status1 === "Busy") {
                            InfoCall.Status = "Busy";
                            TelehealthService.CreateTelehealthCall(InfoCall, CallerID, CallerTeleID, ReceiverTeleID).then(function(msg) {
                                RedisWrap.hget(redisKey, ReceiverTeleUID).then(function(data) {
                                    if (data != null) {
                                        CallerInfo.TimeCall = new Date();
                                        data.push(CallerInfo);
                                        RedisWrap.hset(redisKey, ReceiverTeleUID, data);
                                    } else {
                                        var MissCaller = [];
                                        CallerInfo.TimeCall = new Date();
                                        MissCaller.push(CallerInfo);
                                        RedisWrap.hset(redisKey, ReceiverTeleUID, MissCaller);
                                    }
                                });
                                msg.transaction.commit();
                                res.ok({
                                    message: 'Busy'
                                });
                            }, function(err) {
                                err.transaction.rollback();
                            });
                        } else {
                            if (_.indexOf(sails.sockets.rooms(), ReceiverTeleUID) != -1) {
                                console.log(">>>>>>>>>>>>>>>>> Available <<<<<<<<<<<<<<");
                                opentok.createSession({
                                    mediaMode: "routed"
                                }, function(err, session) {
                                    if (err) return res.serverError(ErrorWrap(err));
                                    InfoCall.Status = "Start Call";

                                    TelehealthService.CreateTelehealthCall(InfoCall, CallerID, CallerTeleID, ReceiverTeleID).then(function(msg) {
                                        var sessionId = session.sessionId;
                                        var tokenOptions = {
                                            role: 'moderator',
                                            expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
                                            data: 'name=Johnny'
                                        };
                                        var token = opentok.generateToken(sessionId, tokenOptions);
                                        console.log("Generate Session Successfully");
                                        if (token != null && sessionId != null) {
                                            msg.transaction.commit();
                                            res.ok({
                                                message: 'Success',
                                                data: {
                                                    apiKey: config.OpentokAPIKey,
                                                    sessionId: sessionId,
                                                    token: token,
                                                    teleCallUID: msg.TeleCallUID
                                                }
                                            })
                                        }
                                    }, function(err) {
                                        err.transaction.rollback();
                                    });
                                });
                            } else {
                                console.log(">>>>>>>>>>>>>>>>> Offline <<<<<<<<<<<<<<");
                                InfoCall.Status = "Offline";
                                TelehealthService.CreateTelehealthCall(InfoCall, CallerID, CallerTeleID, ReceiverTeleID).then(function(msg) {
                                    RedisWrap.hget(redisKey, ReceiverTeleUID).then(function(data) {
                                        if (data != null) {
                                            CallerInfo.TimeCall = new Date();
                                            data.push(CallerInfo);
                                            RedisWrap.hset(redisKey, ReceiverTeleUID, data);
                                        } else {
                                            var MissCaller = [];
                                            CallerInfo.TimeCall = new Date();
                                            MissCaller.push(CallerInfo);
                                            RedisWrap.hset(redisKey, ReceiverTeleUID, MissCaller);
                                        }
                                    });
                                    msg.transaction.commit();
                                    res.ok({
                                        message: 'Offline'
                                    });
                                }, function(err) {
                                    err.transaction.rollback();
                                });
                            }
                        }
                    } else {
                        opentok.createSession({
                            mediaMode: "routed"
                        }, function(err, session) {
                            if (err) return res.serverError(ErrorWrap(err));
                            InfoCall.Status = "Start Call";
                            TelehealthService.CreateTelehealthCall(InfoCall, CallerID, CallerTeleID, ReceiverTeleID).then(function(msg) {
                                var sessionId = session.sessionId;
                                var tokenOptions = {
                                    role: 'moderator',
                                    expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
                                    data: 'name=Johnny'
                                };
                                var token = opentok.generateToken(sessionId, tokenOptions);
                                console.log("Generate Session Successfully");
                                if (token != null && sessionId != null) {
                                    msg.transaction.commit();
                                    res.ok({
                                        message: 'Success',
                                        data: {
                                            apiKey: config.OpentokAPIKey,
                                            sessionId: sessionId,
                                            token: token,
                                            teleCallUID: msg.TeleCallUID
                                        }
                                    })
                                }
                            }, function(err) {
                                err.transaction.rollback();
                            });
                        });
                    }
                })
            }
        });
    }
}
