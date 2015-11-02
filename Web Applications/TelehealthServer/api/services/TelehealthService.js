var requestify = require('requestify');
var config = sails.config.myconf;
var jwt = require('jsonwebtoken');
var $q = require('q');

function checkOnlineUser(appts) {
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
    sails.sockets.blast('online_users', appts);
}
module.exports = {
    FindByUID: function(uid) {
        return TelehealthUser.find({
            where: {
                UID: uid
            }
        });
    },
    GetAppointmentsByPatient: function(patientUID, limit, coreAuth) {
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
                            Status: "Approved",
                            Enable: "Y"
                        }
                    }, {
                        Patient: {
                            UID: patientUID
                        }
                    }],
                    Limit: limit
                }
            },
            headers: !coreAuth ? {} : {
                'Authorization': coreAuth
            }
        })
    },
    GetAppointmentDetails: function(apptUID, coreAuth) {
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-detail/' + apptUID,
            method: 'GET',
            headers: !coreAuth ? {} : {
                'Authorization': coreAuth
            }
        })
    },
    GetAppointmentList: function(coreAuth) {
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
                            Status: "Approved",
                            Enable: "Y"
                        }
                    }]
                }
            },
            headers: !coreAuth ? {} : {
                'Authorization': coreAuth
            }
        });
    },
    GetOnlineUsers: function(coreAuth) {
        var appts = [];
        TelehealthService.GetAppointmentList(coreAuth).then(function(response) {
            var data = response.getBody();
            if (data.count > 0) {
                appts = data.rows;
                TelehealthUser.findAll().then(function(teleUsers) {
                    for (var i = 0; i < teleUsers.length; i++) {
                        for (var j = 0; j < appts.length; j++) {
                            if (appts[j].Patients.length > 0 && appts[j].Patients[0].UserAccount) {
                                if (teleUsers[i].userAccountID == appts[j].Patients[0].UserAccount.ID) {
                                    appts[j].IsOnline = 0;
                                    appts[j].TeleUID = teleUsers[i].UID;
                                }
                            }
                        }
                    }
                    checkOnlineUser(appts);
                }).catch(function(err) {
                    console.log(err);
                })
            } else checkOnlineUser(appts);
        }).catch(function(err) {
            checkOnlineUser(appts);
        })
    },
    MakeRequest: function(info) {
        return requestify.request(config.CoreAPI + info.path, {
            method: info.method,
            body: !info.body ? null : info.body,
            params: !info.params ? null : info.params,
            headers: !info.headers ? null : info.headers,
            timeout: 1000,
            dataType: 'json'
        })
    },
    GenerateJWT: function(info) {
        var defer = $q.defer();
        if (!info.payload || !info.tokenExpired || !info.userID || !info.type) {
            var err = new Error('GenerateJWT');
            err.pushError('Invalid Params');
            defer.reject(err);
        } else {
            var secretKey = UUIDService.GenerateUUID();
            var token = jwt.sign(info.payload, secretKey, {
                expiresIn: info.tokenExpired
            })
            UserToken.findOrCreate({
                where: {
                    UserAccountID: info.userID,
                    SystemType: info.type,
                    DeviceID: !info.deviceID ? null : info.deviceID
                },
                defaults: {
                    SecretKey: secretKey,
                    TokenExpired: 3600 * 24 * 999,
                    Enable: 'Y'
                }
            }).spread(function(userToken, created) {
                if (!created) {
                    userToken.update({
                        SecretKey: secretKey,
                        TokenExpired: 3600 * 24 * 999,
                        SecretCreatedDate: new Date(),
                        Enable: 'Y'
                    }).then(function() {
                        defer.resolve(token);
                    }).catch(function(err) {
                        defer.reject(new Error(err));
                    })
                } else defer.resolve(token);
            }).catch(function(err) {
                defer.reject(new Error(err));
            })
        }
        return defer.promise;
    },
    CheckToken: function(info) {
        var defer = $q.defer();
        if (!info.authorization || !info.useruid || !info.deviceid || !info.devicetype || (info.devicetype && HelperService.const.systemType[info.devicetype.toLowerCase()] == undefined)) {
            var err = new Error("CheckToken.Error");
            err.pushError("Invalid Params");
            defer.reject(err);
        }
        UserAccount.find({
            where: {
                UID: info.useruid
            }
        }).then(function(user) {
            if (!user) {
                var err = new Error("CheckToken.Error");
                err.pushError("User Not Exist");
                defer.reject(err);
            } else {
                UserToken.find({
                    where: {
                        UserAccountID: user.ID,
                        SystemType: HelperService.const.systemType[info.devicetype.toLowerCase()],
                        DeviceID: info.deviceid,
                        Enable: 'Y'
                    }
                }).then(function(userToken) {
                    if (!userToken) {
                        var err = new Error("CheckToken.Error");
                        err.pushError("Invalid Token");
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
                                payload: decoded.payload,
                                secretKey: userToken.SecretKey
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
                })
            }
        })
        return defer.promise;
    }
}