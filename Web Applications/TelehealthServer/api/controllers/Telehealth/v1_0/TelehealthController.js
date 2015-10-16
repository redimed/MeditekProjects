var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
//****Check and parse string to JSON object also lower case all object keys******
function toJson(str) {
    var obj;
    try {
        obj = JSON.parse(str);
    } catch (e) {
        obj = str;
    }
    var key, keys = Object.keys(obj);
    var n = keys.length;
    var newobj = {}
    while (n--) {
        key = keys[n];
        newobj[key.toLowerCase()] = obj[key];
    }
    return newobj;
};
//****Send SMS function******
function sendSMS(toNumber, content, callback) {
    twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    }, callback());
};
module.exports = {
    SendSMS: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.SendSMS.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var phoneNumber = typeof info.phone != 'undefined' ? info.phone : null;
        var content = typeof info.content != 'undefined' ? info.content : null;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber != null && phoneNumber.match(phoneRegex) && content != null) {
            sendSMS(phoneNumber, content, function(err, message) {
                if (err) {
                    res.serverError(ErrorWrap(err));
                    return;
                }
                res.ok({
                    status: 'success',
                    message: 'Send SMS Successfully!'
                });
            });
        } else {
            var err = new Error("Telehealth.SendSMS.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    GetUserDetails: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var uid = typeof info.uid != 'undefined' ? info.uid : null;
        if (uid == null) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        TelehealthService.FindByUID(uid).then(function(teleUser) {
            if (teleUser) {
                teleUser.getUserAccount().then(function(user) {
                    if (user) {
                        TelehealthService.MakeRequest({
                            path: '/api/patient/get-patient',
                            method: 'POST',
                            body: {
                                data: {
                                    'UID': user.UID
                                }
                            }
                        }).then(function(response) {
                            res.json(response.getCode(), response.getBody());
                        }).catch(function(err) {
                            res.json(err.getCode(), err.getBody());
                        })
                    } else {
                        var err = new Error("Telehealth.GetUserDetails.Error");
                        err.pushError("User Is Not Exist");
                        res.serverError(ErrorWrap(err));
                    }
                })
            } else {
                var err = new Error("Telehealth.GetUserDetails.Error");
                err.pushError("User Is Not Exist");
                res.serverError(ErrorWrap(err));
            }
        })
    },
    GetUserAppointments: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var patientUID = typeof info.uid != 'undefined' ? info.uid : null;
        var limit = typeof info.limit != 'undefined' ? info.limit : null;
        if (patientUID == null) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        TelehealthService.GetAppointmentsByPatient(patientUID, limit).then(function(response) {
            res.json(response.getCode(), response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    GetAppointmentDetails: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var apptUID = typeof info.uid != 'undefined' ? info.uid : null;
        if (apptUID == null) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        TelehealthService.GetAppointmentDetails(apptUID).then(function(response) {
            res.json(response.getCode(), response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    TelehealthLogout: function(req, res) {
        req.logout();
        res.ok({
            status: "success"
        });
    },
    TelehealthLogin: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                if (!err) var err = info;
                return res.unauthorize(ErrorWrap(err));
            }
            req.logIn(user, function(err) {
                if (err) res.unauthorize(ErrorWrap(err));
                else {
                    var token = jwt.sign(user, config.TokenSecret, {
                        expiresIn: 3600 * 24
                    });
                    res.ok({
                        status: 'success',
                        message: info.message,
                        user: user,
                        token: token
                    });
                }
            });
        })(req, res);
    },
    UpdateDeviceToken: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.UpdateDeviceToken.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var deviceToken = typeof info.devicetoken != 'undefined' ? info.devicetoken : null;
        var deviceId = typeof info.deviceid != 'undefined' ? info.deviceid : null;
        var deviceType = typeof info.devicetype != 'undefined' ? info.devicetype.toLowerCase() : null;
        var uid = typeof info.uid != 'undefined' ? info.uid : null;
        if (deviceToken != null && uid != null && deviceType != null && deviceId != null) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                TelehealthDevice.findOrCreate({
                    where: {
                        telehealthUserID: teleUser.ID,
                        deviceId: deviceId,
                        type: deviceType == 'android' ? 'ARD' : 'IOS'
                    },
                    defaults: {
                        UID: UUIDService.GenerateUUID(),
                        deviceToken: deviceToken
                    }
                }).spread(function(device, created) {
                    device.update({
                        deviceToken: !created ? deviceToken : device.deviceToken
                    }).then(function() {
                        res.ok({
                            status: 'success',
                            message: 'Success!'
                        })
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                })
            })
        } else {
            var err = new Error("Telehealth.UpdateDeviceToken.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    RequestActivationCode: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.RequestActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var phoneNumber = typeof info.phone != 'undefined' ? info.phone : null;
        var deviceId = typeof info.deviceid != 'undefined' ? info.deviceid : null;
        var deviceType = typeof info.devicetype != 'undefined' ? info.devicetype.toLowerCase() : null;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        var verificationCode = Math.floor(Math.random() * 900000) + 100000;
        if (phoneNumber != null && phoneNumber.match(phoneRegex) && deviceId != null && deviceType != null) {
            UserAccount.find({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    UserActivation.findOrCreate({
                        where: {
                            userAccountID: user.ID,
                            type: deviceType == 'android' ? 'ARD' : 'IOS',
                            deviceID: deviceId
                        },
                        defaults: {
                            verificationCode: verificationCode.toString()
                        }
                    }).spread(function(userActivate, created) {
                        userActivate.update({
                            verificationCode: !created ? verificationCode.toString() : userActivate.verificationCode
                        }).then(function() {
                            sendSMS(phoneNumber, "Your verification code is " + verificationCode, function(err, message) {
                                if (err) {
                                    res.serverError(ErrorWrap(err));
                                    return;
                                }
                                res.ok({
                                    status: 'success',
                                    message: 'Request Verification Code Successfully!'
                                });
                            });
                        }).catch(function(err) {
                            res.serverError(ErrorWrap(err));
                        })
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                } else {
                    var err = new Error("Telehealth.RequestActivationCode.Error");
                    err.pushError("User Is Not Exist");
                    res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        } else {
            var err = new Error("Telehealth.RequestActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    VerifyActivationCode: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.VerifyActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = toJson(req.body.data);
        var verifyCode = typeof info.code != 'undefined' ? info.code : null;
        var deviceId = typeof info.deviceid != 'undefined' ? info.deviceid : null;
        var deviceType = typeof info.devicetype != 'undefined' ? info.devicetype.toLowerCase() : null;
        if (verifyCode != null && deviceId != null && deviceType != null) {
            UserActivation.find({
                where: {
                    verificationCode: verifyCode.toString(),
                    deviceID: deviceId,
                    type: deviceType == 'android' ? 'ARD' : 'IOS'
                }
            }).then(function(userActivate) {
                if (userActivate) {
                    TelehealthUser.findOrCreate({
                        where: {
                            userAccountID: userActivate.userAccountID
                        },
                        defaults: {
                            UID: UUIDService.GenerateUUID()
                        }
                    }).spread(function(teleUser, created) {
                        teleUser.getUserAccount().then(function(userAccount) {
                            if (userAccount) {
                                userAccount.getPatient().then(function(patient) {
                                    if (patient) {
                                        var token = jwt.sign(teleUser, config.TokenSecret, {
                                            expiresIn: 3600 * 24
                                        });
                                        res.ok({
                                            status: 'success',
                                            message: 'User Activated!',
                                            uid: teleUser.UID,
                                            patientUID: patient.UID,
                                            token: token
                                        });
                                    } else {
                                        var err = new Error("Telehealth.VerifyActivationCode.Error");
                                        err.pushError("Only Patient Can Logged In");
                                        res.serverError(ErrorWrap(err));
                                    }
                                })
                            } else {
                                var err = new Error("Telehealth.VerifyActivationCode.Error");
                                err.pushError("User Is Not Exist");
                                res.serverError(ErrorWrap(err));
                            }
                        })
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                } else {
                    var err = new Error("Telehealth.VerifyActivationCode.Error");
                    err.pushError("Invalid Verification Code");
                    res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        } else {
            var err = new Error("Telehealth.VerifyActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    }
}