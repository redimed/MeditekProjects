var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = sails.config.myconf;
module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        TelehealthService.CheckToken(req.headers).then(function(result) {
            var decoded = result.payload;
            var userToken = result.userToken;
            var user = result.user;
            // req.user = decoded;
            delete decoded['iat'];
            delete decoded['exp'];
            return next();
            // jwt.verify(result.token, userToken.SecretKey, function(err, decode) {
            //     if (err) {
            //         if (err.name == 'TokenExpiredError') return next();
            //         else return res.serverError(ErrorWrap(err));
            //     } else return next();
            // })
        }).catch(function(err) {
            return res.serverError(ErrorWrap(err));
        })
    } else {
        var error = new Error("CheckToken");
        error.pushError("notAuthenticated");
        return res.unauthorize(ErrorWrap(error));
    }
}