var requestify = require('requestify');
var config = sails.config.myconf;
var jwt = require('jsonwebtoken');
var url = require('url');
var $q = require('q');
var http = require('http');
var _ = require('lodash');
var rootPath = process.cwd();
var apn = require('apn');
var gcm = require('node-gcm');

module.exports = {
    GetDoctor: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/doctor/get-doctor',
            method: 'POST',
            body: body,
            headers: headers
        });
    },
    CheckToken: function(info) {
        var defer = $q.defer();
        if (!info.authorization || !info.deviceid || !info.systemtype || (info.systemtype && HelperService.const.systemType[info.systemtype.toLowerCase()] == undefined)) {
            var err = new Error("CheckToken.Error");
            err.pushError("Invalid Params");
            defer.reject(err);
        }
        var parts = info.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0];
            var credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                var token = credentials;
                var decoded = jwt.decode(token, {
                    complete: true
                });
                defer.resolve({
                    token: token,
                    payload: decoded ? decoded.payload : null
                })
            } else {
                var err = new Error("CheckToken.Error");
                err.pushError("Invalid Token Format");
                defer.reject(err);
            }
        } else {
            var err = new Error("CheckToken.Error");
            err.pushError("Invalid Token Format");
            defer.reject(err);
        }
        return defer.promise;
    },
    MakeRequest: function(info) {
        delete info.headers['if-none-match'];
        delete info.headers['content-length'];
        // info.headers['content-length'] = Buffer.byteLength(info.body);
        return requestify.request((info.host ? info.host : config.CoreAPI) + info.path, {
            method: info.method,
            body: !info.body ? null : info.body,
            params: !info.params ? null : info.params,
            headers: !info.headers ? null : info.headers,
            dataType: 'json',
            withCredentials: true,
            rejectUnauthorized: false
        })
    },
    SendGCMPush: function(opts, tokens, gcmSender) {
        var defer = $q.defer();
        var message = new gcm.Message(opts);
        var regTokens = tokens;
        gcmSender.send(message, {
            registrationIds: regTokens
        }, 10, function(err, result) {
            if (err) defer.reject({
                message: err
            });
            defer.resolve({
                message: result
            });
        })
        return defer.promise;
    },
    SendAPNPush: function(opts, tokens) {
        var regTokens = tokens;
        var note = new apn.Notification();
        note.badge = parseInt(opts.badge);
        note.sound = opts.sound || "ringtone.wav";
        note.alert = opts.alert ? opts.alert : 'You have a new message!';
        note.category = opts.category ? opts.category : null;
        note.payload = opts.payload ? opts.payload : {};
        note['content-available'] = 1;
        apnConnection.pushNotification(note, regTokens);
    }
}
