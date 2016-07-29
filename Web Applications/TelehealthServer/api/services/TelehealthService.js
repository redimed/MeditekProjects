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
var options = {
    cert: config.APNCert,
    key: config.APNKey,
    passphrase: '1234',
    production: config.APNIsProduction
};
var apnConnection = new apn.Connection(options);
apnConnection.on("connected", function() {
    console.log("APN Connected");
});
apnConnection.on("transmitted", function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString("hex"));
});
apnConnection.on("transmissionError", function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode === 8) {
        console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
});
apnConnection.on("timeout", function() {
    console.log("APN Connection Timeout");
});
apnConnection.on("disconnected", function() {
    console.log("Disconnected from APNS");
});
apnConnection.on("socketError", console.error);
module.exports = {
    FindByUID: function(uid) {
        return TelehealthUser.find({
            where: {
                UID: uid
            }
        });
    },
    CheckOnlineUser: function(appts) {
        var list = sails.sockets.rooms();
        if (appts.length > 0 && list.length > 0) {
            for (var j = 0; j < appts.length; j++) {
                var appt = appts[j];
                appt.IsOnline = 0;
                for (var i = 0; i < list.length; i++) {
                    if (appt.TeleUID == list[i]) appt.IsOnline = 1;
                }
            }
        }
        return appts;
    },
    GetAppointmentsByPatient: function(headers, body) {
        headers['content-type'] = "application/json";
        var typeArr = ['WAA', 'TEL'];
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-wa-list',
            method: 'POST',
            body: body,
            headers: headers
        })
    },
    GetPatientDetails: function(patientUID, headers) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/patient/get-patient',
            method: 'POST',
            body: {
                data: {
                    'UID': patientUID
                }
            },
            headers: headers
        });
    },
    UpdatePatientDetails: function(headers, body) {
        headers['content-type'] = 'application/json';
        body.UserAccountUID = headers.useruid;
        console.log("headers . . . ",headers.useruid);
        console.log("body ..... ",body);
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/patient/update-patient',
            method: 'POST',
            body: body,
            headers: headers
        });
    },
    ChangeEnableFile: function(headers, body) {
        headers['content-type'] = 'application/json';
        body.UserAccountUID = headers.useruid;
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/change-enable-file',
            method: 'POST',
            body: body,
            headers: headers
        });
    },
    GetListDoctor: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/doctor/loadlist-doctor',
            method: 'POST',
            body: body,
            headers: headers
        });
    },
    GetListCountry: function(headers) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/patient/get-listcountry',
            method: 'GET',
            headers: headers
        })
    },
    GetWAAppointmentDetails: function(apptUID, headers) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-wa-detail/' + apptUID,
            method: 'GET',
            headers: headers
        })
    },
    GetTelehealthAppointmentDetails: function(apptUID, headers) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-detail/' + apptUID,
            method: 'GET',
            headers: headers
        })
    },
    GetAppointmentList: function(headers, body) {
        headers['content-type'] = "application/json";
        var typeArr = ['WAA', 'TEL'];
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-list',
            method: 'POST',
            body: body,
            headers: headers
        });
    },
    RequestAppointmentPatient: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-wa-request/patient',
            method: 'POST',
            body: body,
            headers: headers
        });
    },
    PostCoreServer: function(path, method, body, headers) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: path,
            method: method,
            body: body,
            headers: headers
        });
    },
    GetCoreServer: function(path, method, headers) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: path,
            method: method,
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
