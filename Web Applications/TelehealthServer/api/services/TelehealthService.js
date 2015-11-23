var requestify = require('requestify');
var config = sails.config.myconf;
var jwt = require('jsonwebtoken');
var $q = require('q');
var _ = require('lodash');
var rootPath = process.cwd();
var gcm = require('node-gcm');
var gcmSender = new gcm.Sender(config.GCMApiKey);
var apn = require('apn');
var options = {
    //=======Dev======
    cert: rootPath + '/config/push_key/TelePushCert.pem',
    key: rootPath + '/config/push_key/TelePushKey.pem',
    //=======Production=========
    // cert: rootPath + '/config/push_key/TelePatientPushCert.pem',
    // key: rootPath + '/config/push_key/TelePatientPushKey.pem',
    passphrase: '1234',
    production: false
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
    GetAppointmentsByPatient: function(patientUID, limit, type, headers) {
        delete headers['if-none-match'];
        var typeArr = ['WAA', 'TEL'];
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-list',
            method: 'POST',
            body: {
                data: {
                    Order: [{
                        Appointment: {
                            FromTime: 'DESC'
                        }
                    }],
                    Filter: [{
                        Appointment: {
                            Enable: "Y"
                        }
                    }, {
                        Patient: {
                            UID: patientUID
                        }
                    }, {
                        TelehealthAppointment: {
                            Type: type && _.contains(typeArr, type) ? type : null
                        }
                    }],
                    Limit: !limit ? null : limit
                }
            },
            headers: headers
        })
    },
    GetPatientDetails: function(patientUID, headers) {
        delete headers['if-none-match'];
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
    GetWAAppointmentDetails: function(apptUID, headers) {
        delete headers['if-none-match'];
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-wa-detail/' + apptUID,
            method: 'GET',
            headers: headers
        })
    },
    GetTelehealthAppointmentDetails: function(apptUID, headers) {
        delete headers['if-none-match'];
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-detail/' + apptUID,
            method: 'GET',
            headers: headers
        })
    },
    GetAppointmentList: function(headers, type) {
        delete headers['if-none-match'];
        var typeArr = ['WAA', 'TEL'];
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-list',
            method: 'POST',
            body: {
                data: {
                    Order: [{
                        Appointment: {
                            FromTime: 'DESC'
                        }
                    }],
                    Filter: [{
                        Appointment: {
                            FromTime: sails.moment().format('YYYY-MM-DD ZZ'),
                            Enable: "Y"
                        }
                    }, {
                        TelehealthAppointment: {
                            Type: type && _.contains(typeArr, type) ? type : null
                        }
                    }]
                }
            },
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
        return requestify.request(config.CoreAPI + info.path, {
            method: info.method,
            body: !info.body ? null : info.body,
            params: !info.params ? null : info.params,
            headers: !info.headers ? null : info.headers,
            dataType: 'json',
            withCredentials: true
        })
    },
    SendGCMPush: function(opts, tokens) {
        var defer = $q.defer();
        var message = new gcm.Message(opts)
        var regTokens = tokens;
        gcmSender.send(message, {
            registrationIds: regTokens
        }, 10 , function(err, result) {
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
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.badge = opts.badge ? opts.badge : 1;
        note.sound = "ping.aiff";
        note.alert = opts.alert ? opts.alert : 'You have a new message!';
        note.category = opts.category ? opts.category : null;
        note.payload = opts.payload ? opts.payload : {};
        apnConnection.pushNotification(note, regTokens);
    }
}