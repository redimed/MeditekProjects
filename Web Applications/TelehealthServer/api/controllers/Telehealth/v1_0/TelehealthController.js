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
function sendSMS(toNumber, content) {
    return twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    });
};
module.exports = {
    SendSMS: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            var err = new Error("Telehealth.SendSMS.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var info = toJson(req.body.data);
        var phoneNumber = info.phone;
        var content = info.content;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && content) {
            sendSMS(phoneNumber, content).then(function(mess) {
                return res.ok({
                    status: 'success',
                    message: 'Send SMS Successfully!'
                });
            }, function(error) {
                return res.serverError(ErrorWrap(err));
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
            return res.serverError(ErrorWrap(err));
        }
        var info = toJson(req.body.data);
        var uid = info.uid;
        if (!uid) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
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
        var patientUID = info.uid;
        var limit = info.limit;
        if (!patientUID) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
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
        var apptUID = info.uid;
        if (!apptUID) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
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
        var deviceToken = info.devicetoken;
        var deviceId = info.deviceid;
        var deviceType = info.devicetype;
        var uid = info.uid;
        if (deviceToken && uid && deviceType && deviceId) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                TelehealthDevice.findOrCreate({
                    where: {
                        telehealthUserID: teleUser.ID,
                        deviceId: deviceId,
                        type: deviceType.toLowerCase() == 'android' ? 'ARD' : 'IOS'
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
        var phoneNumber = info.phone;
        var deviceId = info.deviceid;
        var deviceType = info.devicetype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        var verificationCode = Math.floor(Math.random() * 900000) + 100000;
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType) {
            UserAccount.find({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    UserActivation.findOrCreate({
                        where: {
                            userAccountID: user.ID,
                            type: deviceType.toLowerCase() == 'android' ? 'ARD' : 'IOS',
                            deviceID: deviceId
                        },
                        defaults: {
                            verificationCode: verificationCode.toString()
                        }
                    }).spread(function(userActivate, created) {
                        userActivate.update({
                            verificationCode: !created ? verificationCode.toString() : userActivate.verificationCode
                        }).then(function() {
                            sendSMS(phoneNumber, "Your verification code is " + verificationCode).then(function(mess) {
                                return res.ok({
                                    status: 'success',
                                    message: 'Request Verification Code Successfully!'
                                });
                            }, function(error) {
                                return res.serverError(ErrorWrap(err));
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
        var verifyCode = info.code;
        var deviceId = info.deviceid;
        var deviceType = info.devicetype;
        if (verifyCode && deviceId && deviceType) {
            UserActivation.find({
                where: {
                    verificationCode: verifyCode.toString(),
                    deviceID: deviceId,
                    type: deviceType.toLowerCase() == 'android' ? 'ARD' : 'IOS'
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
                                            userUID: userAccount.UID,
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