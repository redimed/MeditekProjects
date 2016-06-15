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

function ChangeStatus(TeleUID, status) {
    try {
        TelehealthService.UpdateStatusTelehealthUser(TeleUID, status).then(function(msg) {
            if (msg.message === 'Success') {
                console.log("Change status ", status, TeleUID);
            } else {
                console.log("Change status fail ", msg.message);
            }
        }, function(err) {
            console.log("Change status error :", err);
        });
    } catch (err) {
        console.log("ChangeStatus ", err);
    }
};

function AddRedis(TeleUID, CallerInfo) {
    try {
        RedisWrap.hget(redisKey, TeleUID).then(function(data) {
            if (data != null) {
                CallerInfo.TimeCall = new Date();
                data.push(CallerInfo);
                RedisWrap.hset(redisKey, TeleUID, data);
            } else {
                var MissCaller = [];
                CallerInfo.TimeCall = new Date();
                MissCaller.push(CallerInfo);
                RedisWrap.hset(redisKey, TeleUID, MissCaller);
            }
        });
    } catch (err) {
        console.log("AddRedis ", err);
    }
};

function CheckDevice(TeleUID) {
    try {
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
    } catch (err) {
        console.log("CheckDevice ", err);
    }
};

function startCall(callerInfo, receiverInfo, info) {
    try {
        var callerID = callerInfo.ID;
        var callerTeleID = callerInfo.TelehealthUser.ID;
        var callerTeleUID = callerInfo.TelehealthUser.UID;

        var receiverID = receiverInfo.ID;
        var receiverTeleID = receiverInfo.TelehealthUser.ID;
        var receiverTeleUID = receiverInfo.TelehealthUser.UID;

        var infoCall = {
            FromUserAccountID: callerID,
            ToUserAccountID: receiverID,
            Status: "StartCall"
        };

        opentok.createSession({
            mediaMode: "routed"
        }, function(err, session) {
            if (err) return res.serverError(ErrorWrap(err));
            var sessionId = session.sessionId;
            var tokenOptions = {
                role: 'moderator',
                expireTime: (new Date().getTime() / 1000) + (7 * 24 * 60 * 60),
                data: 'name=name'
            };
            var token = opentok.generateToken(sessionId, tokenOptions);
            TelehealthService.CreateTelehealthCall(infoCall).then(function(msg) {
                if (msg.message === "success") {
                    TelehealthService.CreateTelehealthCallUser(msg.teleCallID, callerTeleID, callerID).then(function(msg0) {
                        if (msg0.message === "success") {
                            ChangeStatus(callerTeleUID, 'Busy');
                            var data = {
                                message: "startcall",
                                data: {
                                    apiKey: config.OpentokAPIKey,
                                    sessionId: sessionId,
                                    token: token,
                                    teleCallUID: msg.teleCallUID,
                                    teleCallID: msg.teleCallID,
                                    receiverTeleUID: receiverTeleUID,
                                    receiverUID: receiverInfo.UID,
                                    callName: info.callName
                                }
                            };
                            sails.sockets.broadcast(callerTeleUID, 'receiveMessage', data);
                        } else {
                            console.log(msg0.err);
                        }
                    });
                } else {
                    console.log(msg.err);
                }
            });
        });
    } catch (err) {
        console.log("startCall", err);
    };
};

function inviteCall(callerInfo, receiverInfo, info) {
    try {
        var callerID = callerInfo.ID;
        var callerTeleID = callerInfo.TelehealthUser.ID;
        var callerTeleUID = callerInfo.TelehealthUser.UID;

        var receiverID = receiverInfo.ID;
        var receiverTeleID = receiverInfo.TelehealthUser.ID;
        var receiverTeleUID = receiverInfo.TelehealthUser.UID;

        var teleCallUID = info.teleCallUID;
        var teleCallID = info.teleCallID;

        var tokenOptions = {
            role: 'moderator'
        };

        TelehealthService.CheckDevice(receiverTeleUID).then(function(msg) {
            if (msg.message === 'success') {
                TelehealthService.CreateTelehealthCallUser(teleCallID, receiverTeleID, receiverID).then(function(msg0) {
                    if (msg0.message === "success") {
                        if (msg.Devices.iosDevices.length === 0 && msg.Devices.androidDevices.length === 0) {
                            if (sails.sockets.rooms().indexOf(receiverTeleUID) >= 0) {
                                if (msg.Devices.teleUser.Status === "Busy") {
                                    console.log(">>>>>>>>>>>>>>>>> Busy <<<<<<<<<<<<<<");
                                    TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Busy').then(function(argument) {
                                        if (argument.message === 'Success') {
                                            AddRedis(receiverTeleUID, callerInfo);
                                            var data = {
                                                message: "busy",
                                                callerTeleUID: callerInfo.TelehealthUser.UID,
                                                receiverTeleUID: receiverInfo.TelehealthUser.UID,
                                                receiverName: receiverInfo.UserName
                                            };
                                            sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', data);
                                        } else {
                                            error = msg.err;
                                        };
                                    });
                                } else {
                                    console.log(">>>>>>>>>>>>>>>>> Available <<<<<<<<<<<<<<");
                                    ChangeStatus(receiverTeleUID, 'Busy');
                                    token = opentok.generateToken(info.sessionId, tokenOptions);
                                    var data = {
                                        message: "call",
                                        apiKey: config.OpentokAPIKey,
                                        sessionId: info.sessionId,
                                        token: token,
                                        callerInfo: callerInfo,
                                        teleCallUID: teleCallUID,
                                        teleCallID: teleCallID,
                                        callName: info.callName,
                                        callerName: callerInfo.UserName,
                                        receiverName: receiverInfo.UserName,
                                        receiverTeleUID: receiverTeleUID,
                                        callerTeleUID: callerTeleUID
                                    };
                                    sails.sockets.broadcast(receiverTeleUID, 'receiveMessage', data);
                                };
                            } else {
                                console.log(">>>>>>>>>>>>>>>>> Offline <<<<<<<<<<<<<<");
                                TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Offline').then(function(argument) {
                                    if (argument.message === 'Success') {
                                        AddRedis(receiverTeleUID, callerInfo);
                                        console.log("teleCallUID ", teleCallUID);
                                        var data = {
                                            message: "offline",
                                            callerTeleUID: callerInfo.TelehealthUser.UID,
                                            receiverTeleUID: receiverInfo.TelehealthUser.UID,
                                            receiverName: receiverInfo.UserName
                                        };
                                        sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', data);
                                    } else {
                                        error = msg.err;
                                    };
                                });
                            };
                        } else {
                            var token = opentok.generateToken(info.sessionId, tokenOptions);
                            var pushInfo = {
                                data: {
                                    "data": {
                                        "apiKey": config.OpentokAPIKey,
                                        "message": "call",
                                        "fromName": (!callerInfo.UserName ? 'Unknown' : callerInfo.UserName),
                                        "sessionId": info.sessionId,
                                        "token": token,
                                        "from": data.receiverTeleUID
                                    }
                                },
                                content: 'Calling From ' + (!data.callerName ? 'Unknown' : data.callerName),
                                category: 'CALLING_MESSAGE'
                            };
                            if (msg.Devices.iosDevices.length > 0) {
                                pushGCMNotification(pushInfo, Devices.androidDevices);
                            };
                            if (msg.Devices.androidDevices.length > 0) {
                                pushAPNNotification(pushInfo, Devices.iosDevices);
                            };
                            if (sails.sockets.rooms().indexOf(receiverTeleUID) >= 0) {
                                if (msg.Devices.teleUser.Status != "Busy") {
                                    var data = {
                                        message: "call",
                                        apiKey: config.OpentokAPIKey,
                                        sessionId: info.sessionId,
                                        token: token,
                                        teleCallUID: teleCallUID,
                                        teleCallID: teleCallID,
                                        callName: info.callName
                                    };
                                    console.log("---------------- Send Message Call ----------------");
                                    sails.sockets.broadcast(receiverTeleUID, 'receiveMessage', data);
                                };
                            };
                        };
                    } else {
                        console.log(msg0.err);
                    }
                });
            } else {
                error = msg.err;
            };
        });
    } catch (err) {
        console.log("inviteCall", err);
    };
};

function GetID(callerUID, callerTeleUID, receiverUID, receiverTeleUID) {
    try {
        var defer = $q.defer();
        var data = {};
        TelehealthService.FindTelehealthUserByUIDs(callerTeleUID, receiverTeleUID).then(function(teleUsers) {
            if (teleUsers.message === 'success') {
                // console.log("teleUsers ", teleUsers);
                data.Telehealth = teleUsers.data;
                TelehealthService.FindUserByUIDs(callerUID, receiverUID).then(function(users) {
                    if (users.message === 'success') {
                        data.UserAccount = users.data;
                        defer.resolve({
                            message: 'success',
                            data: data
                        });
                    };
                });
            };
        });
        return defer.promise;
    } catch (err) {
        console.log("GetID", err);
    };
};

module.exports = {
    JoinConferenceRoom: function(req, res) {
        // console.log("JoinConferenceRoom");
        if (!req.isSocket) {
            var err = new Error("Socket.JoinConferenceRoom.Error");
            err.pushError("Socket Request Only!");
            return res.serverError(ErrorWrap(err));
        }
        var uid = req.param('uid');
        var error = null;
        if (uid) {
            // console.log("JoinConferenceRoom uid ", uid, req.isSocket);
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                if (teleUser) {
                    var roomSocket = [];
                    sails.sockets.join(req.socket, uid);
                    // console.log("roomList", sails.sockets.rooms());
                    // sails.sockets.leave(req.socket ,sails.sockets.rooms()[0]);
                    _.forEach(sails.sockets.rooms(), function(value, key) {
                        if (value.startsWith("/#")) {
                            sails.sockets.leave(req.socket, value);
                        }
                        // console.log("roomList" + key,sails.sockets.rooms());
                    });
                    console.log("JoinConferenceRoom Successfully", uid);
                    // console.log("roomList", sails.sockets.rooms());
                    RedisWrap.hget(redisKey, uid).then(function(data) {
                        if (data != null) {
                            var info = {
                                message: 'misscall',
                                data: data
                            };
                            sails.sockets.broadcast(uid, 'receiveMessage', info);
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
        console.log("MessageTransferNew");
        sails.log.debug("Socket MessageTransfer: " + JSON.stringify(req.params.all()));
        // console.log(req.params.all());
        // Start Call
        var message = req.param('message');
        if (!message) return;
        var CallerInfo = req.param('callerInfo');
        var ReceiverInfo = req.param('receiverInfo');
        var callName = req.param('callName');
        // Call
        var sessionId = req.param('sessionId');
        var teleCallID = req.param('teleCallID');
        var teleCallUID = req.param('teleCallUID');
        // Other
        var callerTeleUID = req.param('callerTeleUID');
        var receiverTeleUID = req.param('receiverTeleUID');

        var Info = {
            message: message,
            sessionId: sessionId,
            teleCallUID: teleCallUID,
            teleCallID: teleCallID,
            callName: callName,
            callerTeleUID: callerTeleUID,
            receiverTeleUID: receiverTeleUID
        };

        // var roomList = sails.sockets.rooms();
        // console.log("---------------- Room List ----------------");
        // console.log(roomList);

        switch (message.toLowerCase()) {
            case "startcall": // Start check online , offline , busy of receiver
                console.log("startcall ");
                GetID(CallerInfo.UID, CallerInfo.TelehealthUser.UID, ReceiverInfo.UID, ReceiverInfo.TelehealthUser.UID).then(function(data) {
                    if (data.message === "success") {
                        CallerInfo.TelehealthUser.ID = data.data.Telehealth[0].ID;
                        ReceiverInfo.TelehealthUser.ID = data.data.Telehealth[1].ID;
                        CallerInfo.ID = data.data.UserAccount[0].ID;
                        ReceiverInfo.ID = data.data.UserAccount[1].ID;
                        startCall(CallerInfo, ReceiverInfo, Info);
                    };
                });
                break;
            case "call": // Transfer message to Receiver
                console.log("call ");
                GetID(CallerInfo.UID, CallerInfo.TelehealthUser.UID, ReceiverInfo.UID, ReceiverInfo.TelehealthUser.UID).then(function(data) {
                    if (data.message === "success") {
                        CallerInfo.TelehealthUser.ID = data.data.Telehealth[0].ID;
                        CallerInfo.ID = data.data.UserAccount[0].ID;
                        ReceiverInfo.TelehealthUser.ID = data.data.Telehealth[1].ID;
                        ReceiverInfo.ID = data.data.UserAccount[1].ID;
                        ReceiverInfo.UserName = data.data.UserAccount[1].UserName;
                        inviteCall(CallerInfo, ReceiverInfo, Info);
                    };
                });
                break;
            case "answer": // Receiver choose anwer in message
                console.log("answer ", callerTeleUID);
                sails.sockets.broadcast(receiverTeleUID, 'receiveMessage', Info);
                break;
            case "calling": // When receiver realy call
                console.log("calling ");
                var receiverName = req.param('receiverName');
                Info.receiverName = receiverName;
                TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'Calling').then(function(argument) {
                    if (argument.message === 'Success') {
                        console.log("Update Status Telehealth Call Success");
                        sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', Info);
                    } else {
                        error = argument.message;
                    };
                });
                break;
            case "decline": // Receiver choose cancel in message
                console.log("decline ", callerTeleUID);
                var receiverName = req.param('receiverName');
                Info.receiverName = receiverName;
                sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', Info);
                ChangeStatus(receiverTeleUID, 'Available');
                break;
            case "cancel": // Caller or Receiver choose cancel in window waiting
                console.log("cancel");
                var cancelName = req.param('cancelName');
                var cancel = req.param('cancel');
                Info.cancelName = cancelName;
                sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', Info);
                ChangeStatus(cancel, 'Available');
                break;
            case "issue": // Device Caller or Receiver has issue
                console.log("addissue");
                var issueName = req.param('issueName');
                var issue = req.param('issue');
                Info.issueName = issueName;
                sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', Info);
                sails.sockets.broadcast(issue, 'receiveMessage', Info);
                ChangeStatus(receiverTeleUID, 'Available');
                break;
            case "waiting": // Caller or Receiver no action in message > 2m
                console.log("waiting", CallerInfo);
                var receiverName = req.param('receiverName');
                Info.receiverName = receiverName;
                sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', Info);
                ChangeStatus(receiverTeleUID, 'Available');
                RedisWrap.hget(redisKey, receiverTeleUID).then(function(data) {
                    if (data != null) {
                        CallerInfo.TimeCall = new Date();
                        data.push(CallerInfo);
                        RedisWrap.hset(redisKey, receiverTeleUID, data);
                        Info.misscall = data;
                        sails.sockets.broadcast(receiverTeleUID, 'receiveMessage', Info);
                    } else {
                        var MissCaller = [];
                        CallerInfo.TimeCall = new Date();
                        MissCaller.push(CallerInfo);
                        RedisWrap.hset(redisKey, receiverTeleUID, MissCaller);
                        Info.misscall = MissCaller;
                        sails.sockets.broadcast(receiverTeleUID, 'receiveMessage', Info);
                    }
                });
                break;
            case "destroy": // When call have 2 person and 1 person disconnect
                var currentUID = req.param("currentUID");
                console.log("currentUID ", currentUID);
                sails.sockets.broadcast(currentUID, 'receiveMessage', Info);
                ChangeStatus(currentUID, 'Available');
                break;
            case "endcall": // When End Call
                console.log("endcall");
                var UserUid = req.param('UserUid');
                console.log("Even End Call ", teleCallUID, UserUid);
                TelehealthService.UpdateStatusTelehealthCall(teleCallUID, 'EndCall').then(function(argument) {
                    console.log("Update Status Telehealth Call", argument);
                    if (argument.message === 'Success') {
                        console.log("Update Status Telehealth Call Success");
                        ChangeStatus(UserUid, 'Available');
                    } else {
                        console.log(argument.message);
                    }
                });
                RedisWrap.hget(redisKey, UserUid).then(function(data) {
                    if (data != null) {
                        var info0 = {
                            message: 'misscall',
                            data: data,
                        };
                        sails.sockets.broadcast(UserUid, 'receiveMessage', info0);
                    };
                });
                break;
            case "quitcall": // When person 3 close call
                var userquit = req.param('userquit');
                var quitName = req.param('quitName');
                Info.quitName = quitName;
                console.log("Quit Call ", teleCallUID);
                sails.sockets.broadcast("Room-" + teleCallUID, 'addMessage', Info);
                ChangeStatus(userquit, 'Available');
                RedisWrap.hget(redisKey, userquit).then(function(data) {
                    if (data != null) {
                        var info0 = {
                            message: 'misscall',
                            data: data,
                        };
                        sails.sockets.broadcast(userquit, 'receiveMessage', info0);
                    };
                });
                break;
            case "delmisscall": // Remove MissCall in Redis
                console.log("delmisscall ", receiverTeleUID);
                RedisWrap.hdel(redisKey, receiverTeleUID);
                ChangeStatus(receiverTeleUID, 'Available');
                break;
            default:
                console.log("default");
        };
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

    JoinRoomCall: function(req, res) {
        try {
            if (!req.isSocket) {
                var err = new Error("Socket.JoinRoomCall.Error");
                err.pushError("Socket Request Only!");
                return res.serverError(ErrorWrap(err));
            };

            var teleCallUID = req.param('teleCallUID');
            var message = req.param('message');
            var roomList = sails.sockets.rooms();
            if (message === 'joinroom') {
                console.log("JoinRoomCall", "Room-" + teleCallUID);
                // console.log("-----  RoomList 1 -----");
                // console.log(roomList);
                sails.sockets.join(req.socket, "Room-" + teleCallUID);

                _.forEach(roomList, function(value, key) {
                    if (value.startsWith("/#")) {
                        sails.sockets.leave(req.socket, value);
                    }
                    // console.log("roomList" + key,sails.sockets.rooms());
                });

                // console.log("-----  RoomList 2 -----");
                // console.log(sails.sockets.rooms());

                // console.log("----- Member Room Call -----");
                // sails.io.sockets.in("Room-" + teleCallUID).clients(function(error, clients) {
                //     console.log(clients[0]);
                // });
            }
        } catch (err) {
            console.log("JoinRoomCall ", err);
        }
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
    }
}
