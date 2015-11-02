var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
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
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.SendSMS.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var info = HelperService.toJson(req.body.data);
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
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var info = HelperService.toJson(req.body.data);
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
                            },
                            headers: !req.headers.coreauth ? {} : {
                                'Authorization': req.headers.coreauth
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
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var patientUID = info.uid;
        var limit = info.limit;
        if (!patientUID) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.GetAppointmentsByPatient(patientUID, limit, req.headers.coreauth).then(function(response) {
            res.json(response.getCode(), response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    GetAppointmentDetails: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var apptUID = info.uid;
        if (!apptUID) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.GetAppointmentDetails(apptUID, req.headers.coreauth).then(function(response) {
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
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.devicetype;
        passport.authenticate('local', function(err, u, info) {
            if ((err) || (!u)) {
                if (!err) var err = info;
                return res.unauthorize(err);
            }
            req.logIn(u, function(err) {
                if (err) res.unauthorize(err);
                else {
                    if (!deviceType || !deviceId) {
                        var err = new Error("TelehealthLogin");
                        err.pushError("Invalid Params");
                        return res.serverError(ErrorWrap(err));
                    }
                    TelehealthService.GenerateJWT({
                        deviceID: deviceId,
                        payload: u.user,
                        tokenExpired: config.TokenExpired,
                        type: deviceType.toLowerCase() == 'android' ? 'ARD' : 'IOS',
                        userID: u.user.ID
                    }).then(function(token) {
                        res.ok({
                            status: 'success',
                            message: info.message,
                            user: u.user,
                            coreToken: u.token,
                            token: token
                        });
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                }
            });
        })(req, res);
    },
    UpdateDeviceToken: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.UpdateDeviceToken.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
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
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.RequestActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var phoneNumber = info.phone;
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.devicetype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            UserAccount.find({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    TelehealthService.MakeRequest({
                        path: '/api/user-activation/create-user-activation',
                        method: 'POST',
                        body: {
                            UserUID: user.UID,
                            Type: HelperService.const.systemType[deviceType.toLowerCase()],
                            DeviceID: deviceId
                        }
                    }).then(function(response) {
                        var data = response.getBody();
                        sendSMS(phoneNumber, "Your REDiMED account verification code is " + data.VerificationCode).then(function(mess) {
                            return res.ok({
                                status: 'success',
                                message: 'Request Verification Code Successfully!'
                            });
                        }, function(error) {
                            return res.serverError(ErrorWrap(error));
                        });
                    }).catch(function(err) {
                        res.serverError(err.getBody());
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
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.VerifyActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var phoneNumber = info.phone;
        var verifyCode = info.code;
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.devicetype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && verifyCode && deviceId && deviceType && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            UserAccount.find({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    user.getPatient().then(function(patient) {
                        if (patient) {
                            TelehealthService.MakeRequest({
                                path: '/api/user-activation/activation',
                                method: 'GET',
                                params: {
                                    UserUID: user.UID,
                                    SystemType: HelperService.const.systemType[deviceType.toLowerCase()],
                                    DeviceID: deviceId,
                                    VerificationCode: verifyCode
                                }
                            }).then(function(response) {
                                var data = response.getBody();
                                TelehealthUser.findOrCreate({
                                    where: {
                                        userAccountID: user.ID
                                    },
                                    defaults: {
                                        UID: UUIDService.GenerateUUID()
                                    }
                                }).spread(function(teleUser, created) {
                                    TelehealthService.MakeRequest({
                                        path: '/api/login',
                                        method: 'POST',
                                        body: {
                                            'UserName': 1,
                                            'Password': 2,
                                            'UserUID': user.UID,
                                            'DeviceID': deviceId,
                                            'VerificationToken': data.VerificationToken
                                        }
                                    }).then(function(response) {
                                        TelehealthService.GenerateJWT({
                                            deviceID: deviceId,
                                            payload: teleUser.dataValues,
                                            tokenExpired: config.TokenExpired,
                                            type: deviceType.toLowerCase() == 'android' ? 'ARD' : 'IOS',
                                            userID: user.ID
                                        }).then(function(token) {
                                            var returnJson = {
                                                status: 'success',
                                                message: 'User Activated',
                                                uid: teleUser.UID,
                                                userUID: response.getBody().user.UID,
                                                patientUID: patient.UID,
                                                token: token,
                                                coreToken: response.getBody().token
                                            }
                                            res.ok(returnJson);
                                        }).catch(function(err) {
                                            res.serverError(err);
                                        })
                                    })
                                }).catch(function(err) {
                                    return res.serverError(ErrorWrap(err));
                                })
                            }).catch(function(err) {
                                return res.serverError(err.getBody());
                            })
                        } else {
                            var err = new Error("Telehealth.VerifyActivationCode.Error");
                            err.pushError("Only Patient Can Logged In");
                            return res.serverError(ErrorWrap(err));
                        }
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
            var err = new Error("Telehealth.VerifyActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    }
}