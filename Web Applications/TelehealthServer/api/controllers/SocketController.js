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
        var uid = typeof req.param('uid') != 'undefined' ? req.param('uid') : null;
        if (uid != null) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                if (teleUser) {
                    teleUser.getUserAccount().then(function(user) {
                        sails.sockets.join(req.socket, uid + ":" + user.phoneNumber);
                        sails.sockets.leave(req.socket, req.socket.id);
                        console.log("=====Join Rooms=====: ",uid + ":" + user.phoneNumber);
                        TelehealthService.GetOnlineUsers();
                    })
                }
            })
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
        var from = typeof req.param('from') != 'undefined' ? req.param('from') : null;
        var to = typeof req.param('to') != 'undefined' ? req.param('to') : null;
        var message = typeof req.param('message') != 'undefined' ? req.param('message') : null;
        var data = {};
        if (message == null || from == null || to == null) return;
        var list = sails.sockets.rooms();
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].indexOf(":") != -1) {
                    var arr = list[i].split(':');
                    if (arr[1].match(phoneRegex) && arr[0] == to) {
                        data.from = from;
                        data.message = message;
                        if (message.toLowerCase() == 'call') {
                            var sessionId = typeof req.param('sessionId') != 'undefined' ? req.param('sessionId') : null;
                            if (sessionId == null) return;
                            var sessionId = req.param('sessionId');
                            var tokenOptions = {
                                role: 'moderator'
                            };
                            var token = opentok.generateToken(sessionId, tokenOptions);
                            data.apiKey = config.OpentokAPIKey;
                            data.sessionId = sessionId;
                            data.token = token;
                        }
                        console.log("======data======: ", data);
                        sails.sockets.broadcast(list[i], 'receiveMessage', data);
                    }
                }
            }
        }
    },
    OnlineUserList: function(req, res) {
        if (!req.isSocket) {
            res.json(500, {
                status: 'error',
                message: 'Socket Request Only!'
            });
            return;
        }
        TelehealthService.GetOnlineUsers();
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