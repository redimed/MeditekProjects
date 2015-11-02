var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = sails.config.myconf;
module.exports = function(req, res, next) {
    TelehealthService.CheckToken(req.headers).then(function(result) {
        var decoded = result.payload;
        var tokenLeftTime = decoded.exp - decoded.iat;
        var currentTime = (Math.round(new Date().getTime() / 1000)) - decoded.iat;
        var socketRooms = sails.sockets.rooms();
        jwt.verify(result.token, result.secretKey, function(err, decode) {
            if (err) {
                if (err.name == 'TokenExpiredError' && _.includes(socketRooms, decoded.UID)) {
                    var token = jwt.sign(decoded, result.secretKey, {
                        expiresIn: config.TokenExpired
                    })
                    sails.sockets.broadcast(decoded.UID, 'refreshToken', {
                        token: token
                    });
                }
                return res.serverError(ErrorWrap(err));
            }
            req.user = decoded;
            if (tokenLeftTime - currentTime <= 120 && _.includes(socketRooms, decoded.UID)) {
                var token = jwt.sign(decoded, result.secretKey, {
                    expiresIn: config.TokenExpired
                })
                sails.sockets.broadcast(decoded.UID, 'refreshToken', {
                    token: token
                });
            }
            next();
        })
    }).catch(function(err) {
        return res.serverError(ErrorWrap(err));
    })
}