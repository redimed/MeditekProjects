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

function pushAPNNotification(info, devices) {
    var iosMess = {
        badge: 1,
        alert: info.content ? info.content : 'Push Notification From REDiMED',
        payload: info.data ? info.data : {},
        category: info.category ? info.category : null
    };
    TelehealthService.SendAPNPush(iosMess, devices);
};

function ChangeStatus(TeleUID, status) {
    TelehealthService.UpdateStatusTelehealthUser(TeleUID, status).then(function(msg) {
        if (msg.message === 'Success') {
            console.log("Change status " + status);
        } else {
            console.log("Change status fail ", msg.message);
        }
    }, function(err) {
        console.log("Change status error :", err);
    });
};

function AddRedis(TeleUID, CallerInfo) {
    RedisWrap.hget(redisKey, TeleUID).then(function(data) {
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
};

function CheckDevice(TeleUID) {
    if (!TeleUID) return;
    var Devices = {
        iosDevices: [],
        androidDevices: []
    };
    TelehealthService.FindByUID(TeleUID).then(function(teleUser) {
        if (teleUser) {
            Devices.teleUser = teleUser;
            console.log("teleUser ", teleUser);
            TelehealthDevice.findAll({
                where: {
                    TelehealthUserID: teleUser.ID
                }
            }).then(function(devices) {
                if (devices) {
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].DeviceToken != null) {
                            console.log("pushhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", devices[i].DeviceToken);
                            if (devices[i].Type == 'IOS')
                                Devices.iosDevices.push(devices[i].DeviceToken);
                            else
                                Devices.androidDevices.push(devices[i].DeviceToken);
                        }
                    }
                }
            }, function(err) {
                console.log("Error CheckDevice :", err);
            })
        }
    })
    return Devices;
};

function callFunction(data, sessionId) {
    console.log("---------------- CallFunction ----------------");
    var roomList = sails.sockets.rooms();
    if (!sessionId) return;
    var tokenOptions = {
        role: 'moderator'
    };
    var token = opentok.generateToken(sessionId, tokenOptions);
    data.apiKey = config.OpentokAPIKey;
    data.sessionId = sessionId;
    data.token = token;

    var pushInfo = {
        data: {
            "data": {
                "apiKey": config.OpentokAPIKey,
                "message": data.message,
                "fromName": (!data.fromName ? 'Unknown' : data.fromName),
                "sessionId": sessionId,
                "token": token,
                "from": data.from
            }
        },
        content: 'Calling From ' + (!data.fromName ? 'Unknown' : data.fromName),
        category: 'CALLING_MESSAGE'
    };
    TelehealthService.CheckDevice(data.to).then(function(msg) {
        if (msg.message === 'success') {
            if (msg.Devices.iosDevices.length > 0) {
                pushGCMNotification(pushInfo, Devices.androidDevices);
            }
            if (msg.Devices.androidDevices.length > 0) {
                pushAPNNotification(pushInfo, Devices.iosDevices);
            }
            if (_.contains(roomList, data.to)) {
                sails.sockets.broadcast(data.to, 'receiveMessage', data);
                console.log("---------------- Send Message Call ----------------");
            }
        } else {
            error = msg.err;
        }
    });
}

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

module.exports = {
    JoinConferenceRoom: function(req, res) {
<<<<<<< ab625e48a36878f277281ea202afbf29e94e281c
        console.log("aaaaaaa", req.param('uid'), req.isSocket);
        console.log("headers", req.headers);
        console.log("JoinConferenceRoom", req.param('uid'), req.isSocket);
        console.log("Was in the JoinConferenceRoom");
=======
        console.log("JoinConferenceRoom");
>>>>>>> Update Code
        if (!req.isSocket) {
            var err = new Error("Socket.JoinConferenceRoom.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        var uid = req.param('uid');
        var error = null;
        if (uid) {
            console.log("JoinConferenceRoom uid ", uid, req.isSocket);
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
                            // RedisWrap.hdel(redisKey, uid);
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
        var callerInfo = req.param('callerInfo');
        var teleCallUID = req.param('teleCallUID');
        var teleCallID = req.param('teleCallID');
        var sessionId = null;
        var tokenOptions = {
            role: 'moderator'
        };
        sessionId = req.param('sessionId');
        var data = {};
        data.fromName = !fromName ? 'Unknown' : fromName;
        data.from = from;
        data.message = message;
        data.callerInfo = callerInfo;
        data.to = to;
        data.timeCall = new Date();
        data.teleCallUID = teleCallUID;
        data.teleCallID = teleCallID;
        var token = null;
        var roomList = sails.sockets.rooms();

        console.log("---------------- Room List ----------------");
        console.log(roomList);

        if (roomList.length > 0) {
            switch (message.toLowerCase()) {
                case "call": // Transfer message to Receiver
                    callFunction(data, sessionId);
                    break;
                case "answer": // Receiver choose anwer in message
                    console.log("answer ", teleCallUID);
                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Calling').then(function(argument) {
                        console.log("Update Status Telehealth Call");
                        if (argument.message === 'Success') {
                            console.log("Update Status Telehealth Call Success");
                            ChangeStatus(to, 'Busy');
                        } else {
                            error = msg.err;
                        }
                    });
                    break;
                case "decline": // Receiver choose cancel in message
                    console.log("decline ");
                    sails.sockets.broadcast(from, 'receiveMessage', data);
                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Decline').then(function(argument) {
                        console.log("Update Status Telehealth Call");
                        if (argument.message === 'Success') {
                            console.log("Update Status Telehealth Call Success");
                            ChangeStatus(to, 'Available');
                        } else {
                            error = msg.err;
                        }
                    });
                    break;
                case "cancel": // Caller or Receiver choose cancel in window waiting
                    sails.sockets.broadcast(to, 'receiveMessage', data);
                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Cancel').then(function(argument) {
                        console.log("Update Status Telehealth Call");
                        if (argument.message === 'Success') {
                            console.log("Update Status Telehealth Call Success");
                            ChangeStatus(to, 'Available');
                            ChangeStatus(from, 'Available');
                        } else {
                            error = msg.err;
                        }
                    });
                    break;
                case "issue": // Device Caller or Receiver has issue
                    var noissue = req.param('noissue');
                    var issue = req.param('issue');
                    sails.sockets.broadcast(noissue, 'receiveMessage', data);
                    sails.sockets.broadcast(issue, 'receiveMessage', data);
                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Issue').then(function(argument) {
                        console.log("Update Status Telehealth Call");
                        if (argument.message === 'Success') {
                            console.log("Update Status Telehealth Call Success");
                            ChangeStatus(to, 'Available');
                            ChangeStatus(from, 'Available');
                        } else {
                            error = msg.err;
                        }
                    });
                    break;
                case "delredis": // Remove MissCall in Redis
                    console.log("delredis ", to);
                    RedisWrap.hdel(redisKey, to);
                    break;
                case "waiting": // Caller or Receiver no action in message > 2m
                    sails.sockets.broadcast(from, 'receiveMessage', data);
                    console.log("teleCallUID ", teleCallUID);
                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Waiting').then(function(argument) {
                        console.log("Update Status Telehealth Call");
                        if (argument.message === 'Success') {
                            console.log("Update Status Telehealth Call Success");
                            ChangeStatus(to, 'Available');
                            ChangeStatus(from, 'Available');
                        } else {
                            error = msg.err;
                        }
                    });
                    RedisWrap.hget(redisKey, to).then(function(info) {
                        if (info != null) {
                            callerInfo.TimeCall = new Date();
                            info.push(callerInfo);
                            RedisWrap.hset(redisKey, to, info);
                            data.misscall = info;
                            sails.sockets.broadcast(to, 'receiveMessage', data);
                        } else {
                            var MissCaller = [];
                            callerInfo.TimeCall = new Date();
                            MissCaller.push(callerInfo);
                            RedisWrap.hset(redisKey, to, MissCaller);
                            data.misscall = MissCaller;
                            sails.sockets.broadcast(to, 'receiveMessage', data);
                        }
                    });
                    break;
                case "endcall": // When End Call
                    console.log("Even End Call ", teleCallUID, UserUid);
                    var UserUid = req.param('UserUid');
                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'EndCall').then(function(argument) {
                        console.log("Update Status Telehealth Call");
                        if (argument.message === 'Success') {
                            console.log("Update Status Telehealth Call Success");
                            ChangeStatus(UserUid, 'Available');
                        } else {
                            error = msg.err;
                        }
                    });
                    break;
                case "closecall": // When person 3 close window call
                    sails.sockets.broadcast(teleCallUID, 'addMessage', data);
                    break;
            }
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

    CallToReceiver: function(req, res) {
        console.log("Was in the CallToReceiver");
        var info = req.param('info');
        var ReceiverName = info.ReceiverName;
        var ReceiverTeleUID = info.ReceiverTeleUID;
        var ReceiverTeleID = info.ReceiverTeleID;
        var ReceiverID = info.ReceiverID;
        var CallerInfo = info.CallerInfo;
        var CallerID = CallerInfo.ID;
        var CallerTeleID = CallerInfo.TelehealthUser.ID;
        var CallerTeleUID = CallerInfo.TelehealthUser.UID;
        // console.log("Call To Receiver ", info);

        var InfoCall = {
            FromUserAccountID: CallerID,
            ToUserAccountID: ReceiverID
        };

        TelehealthService.CheckDevice(ReceiverTeleUID).then(function(msg) {
            console.log("Devices CallToReceiver ", msg);
            if (msg.message === 'success') {
                if (msg.Devices.iosDevices.length === 0 && msg.Devices.androidDevices.length === 0) {
                    if (msg.Devices.teleUser.Status1 === "Busy") {
                        console.log(">>>>>>>>>>>>>>>>> Busy <<<<<<<<<<<<<<");
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
                        }).catch(function(err) {
                            error = err;
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
                                    console.log("Generate token Successfully");
                                    ChangeStatus(CallerTeleUID, 'Busy');
                                    if (token != null && sessionId != null) {
                                        msg.transaction.commit();
                                        res.ok({
                                            message: 'Success',
                                            data: {
                                                apiKey: config.OpentokAPIKey,
                                                sessionId: sessionId,
                                                token: token,
                                                teleCallUID: msg.TeleCallUID,
                                                teleCallID: msg.TeleCallID
                                            }
                                        });
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
                            ChangeStatus(CallerTeleUID, 'Busy');
                            console.log("Generate Session Successfully");
                            if (token != null && sessionId != null) {
                                msg.transaction.commit();
                                res.ok({
                                    message: 'Success',
                                    data: {
                                        apiKey: config.OpentokAPIKey,
                                        sessionId: sessionId,
                                        token: token,
                                        teleCallUID: msg.TeleCallUID,
                                        teleCallID: msg.TeleCallID
                                    }
                                })
                            }
                        }, function(err) {
                            err.transaction.rollback();
                        });
                    });
                }
            } else {
                error = msg.err;
            }
        });
    },

    AddDoctor: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.AddDoctor.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        };

        sails.log.debug("Socket AddDoctor: " + JSON.stringify(req.params.all()));

        var apiKey = req.param('apiKey');
        var sessionId = req.param('sessionId');
        var CallerInfo = req.param('CallerInfo');
        var CallerID = CallerInfo.ID;
        var CallerTeleID = CallerInfo.TelehealthUser.ID;
        var CallerTeleUID = CallerInfo.TelehealthUser.UID;
        var ReceiverID = req.param('ReceiverID');
        var ReceiverTeleID = req.param('ReceiverTeleID');
        var ReceiverTeleUID = req.param('ReceiverTeleUID');
        var ReceiverName = req.param('ReceiverName');
        var TeleCallID = req.param('TeleCallID');
        var TeleCallUID = req.param('TeleCallUID');

        var tokenOptions = {
            role: 'moderator'
        };

        var data = {
            teleCallUID: TeleCallUID,
            callerInfo: CallerInfo,
            receiverTeleUID: ReceiverTeleUID,
            callerTeleUID: CallerTeleUID
        };
        var token;
        var roomList = sails.sockets.rooms();

        TelehealthService.CheckDevice(ReceiverTeleUID).then(function(msg) {
            if (msg.message === 'success') {
                if (msg.Devices.iosDevices.length === 0 && msg.Devices.androidDevices.length === 0) {
                    if (msg.Devices.teleUser.Status1 === "Busy") {
                        TelehealthService.CreateTelehealthCallUser(TeleCallID, CallerTeleID, CallerID).then(function(info) {
                            if (info.message === 'success') {
                                console.log(">>>>>>>>>>>>>>>>> Person 3 Busy <<<<<<<<<<<<<<");
                                AddRedis(ReceiverTeleUID, CallerInfo);
                                data.message = 'busy';
                                sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                            }
                        })
                    } else {
                        if (_.indexOf(sails.sockets.rooms(), ReceiverTeleUID) != -1) {
                            TelehealthService.CreateTelehealthCallUser(TeleCallID, CallerTeleID, CallerInfo.ID).then(function(info) {
                                if (info.message === 'success') {
                                    console.log(">>>>>>>>>>>>>>>>> Person 3 Available <<<<<<<<<<<<<<");
                                    if (_.contains(roomList, ReceiverTeleUID)) {
                                        token = opentok.generateToken(sessionId, tokenOptions);
                                        data.apiKey = apiKey;
                                        data.sessionId = sessionId;
                                        data.token = token;
                                        data.message = 'addcall';
                                        data.fromName = CallerInfo.UserName;
                                        data.callerInfo = CallerInfo;
                                        console.log("---------------- Send Message Call ----------------");
                                        sails.sockets.broadcast(ReceiverTeleUID, 'receiveMessage', data);
                                    }
                                }
                            });
                        } else {
                            TelehealthService.CreateTelehealthCallUser(TeleCallID, CallerTeleID, CallerInfo.ID).then(function(info) {
                                if (info.message === 'success') {
                                    console.log(">>>>>>>>>>>>>>>>> Person 3 Offline <<<<<<<<<<<<<<");
                                    AddRedis(ReceiverTeleUID, CallerInfo);
                                    data.message = 'offline';
                                    sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                                }
                            });
                        }
                    }
                } else {
                    var pushInfo = {
                        data: {
                            "data": {
                                "apiKey": config.OpentokAPIKey,
                                "message": data.message,
                                "fromName": (!data.fromName ? 'Unknown' : data.fromName),
                                "sessionId": sessionId,
                                "token": token,
                                "from": data.from
                            }
                        },
                        content: 'Calling From ' + (!data.fromName ? 'Unknown' : data.fromName),
                        category: 'CALLING_MESSAGE'
                    };

                    if (msg.Devices.iosDevices.length > 0) {
                        pushGCMNotification(pushInfo, Devices.androidDevices);
                    }
                    if (msg.Devices.androidDevices.length > 0) {
                        pushAPNNotification(pushInfo, Devices.iosDevices);
                    }
                    if (_.contains(roomList, ReceiverTeleUID)) {
                        token = opentok.generateToken(sessionId, tokenOptions);
                        data.apiKey = apiKey;
                        data.sessionId = sessionId;
                        data.token = token;
                        data.message = 'addcall';
                        console.log("---------------- Send Message Call ----------------");
                        sails.sockets.broadcast(ReceiverTeleUID, 'receiveMessage', data);
                    }
                }
            } else {
                error = msg.err;
            }
        });
    },

    AddCallMessage: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.AddCallMessage.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        };
        console.log("---------- AddCallMessage -----------");
        var CallerTeleUID = req.param('callerTeleUID');
        var ReceiverTeleUID = req.param('receiverTeleUID');
        var TeleCallUID = req.param('teleCallUID');
        var CallerInfo = req.param('callerInfo');
        var message = req.param('message');
        var roomList = sails.sockets.rooms();

        sails.log.debug("Socket AddCallMessage: " + JSON.stringify(req.params.all()));

        var data = {
            message: message,
            callerTeleUID: CallerTeleUID,
            receiverTeleUID: ReceiverTeleUID
        };

        switch (message.toLowerCase()) {
            case 'answer':
                console.log("Anwer Success");
                sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                break;
            case 'decline':
                sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                ChangeStatus(CallerTeleUID, 'Available');
                break;
            case 'cancel':
                sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                ChangeStatus(CallerTeleUID, 'Available');
                break;
            case 'issue':
                sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                ChangeStatus(CallerTeleUID, 'Available');
                ChangeStatus(ReceiverTeleUID, 'Available');
                break;
            case 'waiting':
                sails.sockets.broadcast(TeleCallUID, 'addMessage', data);
                ChangeStatus(ReceiverTeleUID, 'Available');
                ChangeStatus(CallerTeleUID, 'Available');
                RedisWrap.hget(redisKey, ReceiverTeleUID).then(function(info) {
                    if (info != null) {
                        CallerInfo.TimeCall = new Date();
                        info.push(CallerInfo);
                        RedisWrap.hset(redisKey, ReceiverTeleUID, info);
                        data.misscall = info;
                        sails.sockets.broadcast(ReceiverTeleUID, 'receiveMessage', data);
                    } else {
                        var MissCaller = [];
                        CallerInfo.TimeCall = new Date();
                        MissCaller.push(CallerInfo);
                        RedisWrap.hset(redisKey, ReceiverTeleUID, MissCaller);
                        data.misscall = MissCaller;
                        sails.sockets.broadcast(ReceiverTeleUID, 'receiveMessage', data);
                    }
                });
                break;
            case "endcall": // When End Call
                console.log("Even End Call ", teleCallUID, UserUid);
                var UserUid = req.param('UserUid');
                TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'EndCall').then(function(argument) {
                    if (argument.message === 'Success') {
                        console.log("Update Status Telehealth Call Success");
                        ChangeStatus(UserUid, 'Available');
                    } else {
                        error = msg.err;
                    }
                });
                break;
            case "closecall": // When person 3 close window call
                sails.sockets.broadcast(teleCallUID, 'addMessage', data);
                break;
        }
    },

    JoinRoomCall: function(req, res) {
        if (!req.isSocket) {
            var err = new Error("Socket.JoinRoomCall.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        };

        var teleCallUID = req.param('teleCallUID');
        var message = req.param('message');
        var roomList = sails.sockets.rooms();
        if (message === 'joinroom') {
            console.log("Joinroom", teleCallUID);
            console.log("-----  RoomList  -----");
            console.log(roomList);
            sails.sockets.join(req.socket, teleCallUID);
            console.log("roomList", roomList);
        }
    }
}
