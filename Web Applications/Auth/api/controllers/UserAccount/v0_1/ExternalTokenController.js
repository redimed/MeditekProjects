/**
 * Created by tannguyen on 01/07/2016.
 */
var moment=require('moment');
var jwt = require('jsonwebtoken');
var o=require("../../../services/HelperService");
module.exports = {
    MakeExternalSecret: function(req, res) {
        var error = new Error("MakeExternalSecret.Error");
        var user = req.user? req.user: {};
        var userAccess = {
            UserID: user.ID,
            ExternalName: req.headers.externalname,
            SystemType: req.headers.systemtype,
            DeviceID: req.headers.deviceid,
            AppID: req.headers.appid
        };

        Services.ExternalToken.MakeExternalSecret(userAccess)
        .then(function(et) {
            var payload = {
                UID: user.UID,
                SecretKey: o.md5(et.SecretKey)
            }
            var token = jwt.sign(
                payload,
                et.SecretKey,
                {
                    expiresIn: et.TokenExpired
                }
            )
            res.ok({
                status: 'success',
                token: token
            })
        },function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    GetExternalSecret: function(req, res) {
        var error = new Error("GetExternalSecret.Error");
        var user = req.user? req.user: {};
        var userAccess = {
            UserID: user.ID,
            ExternalName: req.headers.externalname,
            SystemType: req.headers.systemtype,
            DeviceID: req.headers.deviceid,
            AppID: req.headers.appid
        };

        Services.ExternalToken.GetExternalSecret(userAccess)
        .then(function(et) {
            res.ok(et);
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    GetNewExternalToken: function(req, res) {
        var error = new Error("GetNewExternalToken.Error");
        var user = req.user? req.user: {};
        var userAccess = {
            UserID: user.ID,
            ExternalName: req.headers.externalname,
            SystemType: req.headers.systemtype,
            DeviceID: req.headers.deviceid,
            AppID: req.headers.appid
        };

        Services.ExternalToken.GetExternalSecret(userAccess)
        .then(function(et) {
            var payload = {
                UID: user.UID,
                SecretKey: o.md5(et.SecretKey)
            }
            var token = jwt.sign(
                payload,
                et.SecretKey,
                {
                    expiresIn: et.TokenExpired
                }
            )
            res.ok({
                status: 'success',
                token: token
            })
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    }
}