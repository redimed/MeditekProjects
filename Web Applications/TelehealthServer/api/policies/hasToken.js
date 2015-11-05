var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = sails.config.myconf;
module.exports = function(req, res, next) {
    TelehealthService.CheckToken(req.headers).then(function(result) {
        var decoded = result.payload;
        var userToken = result.userToken;
        var user = result.user;
        req.user = decoded;
        delete decoded['iat'];
        delete decoded['exp'];
        jwt.verify(result.token, userToken.SecretKey, function(err, decode) {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    if (!HelperService.isExpired(userToken.SecretCreatedDate, userToken.TokenExpired)) {
                        TelehealthService.GenerateJWT({
                            deviceID: req.headers.deviceid,
                            payload: decoded,
                            tokenExpired: config.TokenExpired,
                            type: HelperService.const.systemType[req.headers.systemtype.toLowerCase()],
                            userID: user.ID
                        }).then(function(token) {
                            res.set('newtoken', token);
                            res.header('Access-Control-Expose-Headers', 'newtoken');
                            req.headers.authorization = "Bearer "+token;
                            return next();
                        }).catch(function(err) {
                            return res.serverError(ErrorWrap(err));
                        })
                    } else {
                        var error = new Error("CheckToken");
                        error.pushError("secretKeyExpired");
                        return res.serverError(ErrorWrap(error));
                    }
                } else return res.serverError(ErrorWrap(err));
            } else return next();
        })
    }).catch(function(err) {
        return res.serverError(ErrorWrap(err));
    })
}