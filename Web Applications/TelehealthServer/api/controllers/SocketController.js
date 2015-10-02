var config = sails.config.myconf;
//======== Initialize Opentok module ==========
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

        var phoneNumber = typeof req.param('phone') != 'undefined' ? req.param('phone') : null;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        console.log("===Join Room===: ",phoneNumber);
        if (phoneNumber != null && phoneNumber.match(phoneRegex)) sails.sockets.join(req.socket, phoneNumber);
    },
    MessageTransfer: function(req, res) {
        if (!req.isSocket) {
            res.json(500, {
                status: 'error',
                message: 'Socket Request Only!'
            });
            return;
        }
        var fromUser = typeof req.param('from') != 'undefined' ? req.param('from') : null;
        var toUser = typeof req.param('to') != 'undefined' ? req.param('to') : null;
        var message = typeof req.param('message') != 'undefined' ? req.param('message') : null;
        var data = {};
        if (message == null || fromUser == null || toUser == null) return;
        data.from = fromUser;
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
        console.log("=======data======: ",data);
        sails.sockets.broadcast(toUser, 'receiveMessage', data);
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