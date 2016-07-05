/**
 * Created by tannguyen on 04/07/2016.
 */
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o = require("../services/HelperService");
var ErrorWrap = require("../services/ErrorWrap");
var jwt = require('jsonwebtoken');
module.exports = function(req, res, next){
    var error = new Error('Policies.checkExternalToken.Error');
    var authorization = req.headers.authorization;
    if(authorization) {
        if(authorization.startsWith('Bearer ')) {
            var token = authorization.slice('Bearer '.length);
            var userAccess = {
                UserUID: req.headers.useruid,
                ExternalName: req.headers.externalname,
                SystemType: req.headers.systemtype,
                DeviceID: req.headers.deviceid,
                AppID: req.headers.AppID
            }
            Services.UserAccount.GetUserAccountDetails({UID: userAccess.UserUID}, ['ID'])
            .then(function(user) {
                if (user) {
                    userAccess.UserID = user.ID;
                    Services.ExternalToken.GetExternalSecret(userAccess)
                    .then(function(es) {
                        if(es) {
                            jwt.verify(token, es.SecretKey, {algorithms: ['HS256']}, function(err, decoded) {
                               if(!err) {
                                    return next();
                               } else {
                                    error.pushError("token.invalidOrExpired");
                                    return res.unauthor(ErrorWrap(error));
                               }
                            });
                        } else {
                            error.pushError("externalSecret.notFound");
                            return res.unauthor(ErrorWrap(error));
                        }
                    }, function(err) {
                        console.log(err);
                        error.pushError('externalSecret.queryError');
                        return res.unauthor(ErrorWrap(error));
                    });
                } else {
                    error.pushError('user.notFound');
                    return res.unauthor(ErrorWrap(error));
                }

            }, function(err) {
                console.log(err);
                error.pushError('user.queryError');
                return res.unauthor(ErrorWrap(error));
            })
        } else {
            error.pushError("authorization.failPattern");
            return res.unauthor(ErrorWrap(error));
        }
    } else {
        error.pushError('authorization.notProvided');
        return res.unauthor(ErrorWrap(error));
    }
}