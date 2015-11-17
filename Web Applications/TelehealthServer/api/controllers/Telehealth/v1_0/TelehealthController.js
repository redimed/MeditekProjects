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
    GetUserDetails: function(req, res) {
        var params = req.params.all();
        if (!params.uid) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var uid = params.uid;
        var headers = req.headers;
        var deviceType = headers.systemtype;
        if (!uid || !deviceType || HelperService.const.systemType[deviceType.toLowerCase()] == undefined) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.FindByUID(uid).then(function(teleUser) {
            if (teleUser) {
                teleUser.getUserAccount().then(function(user) {
                    if (user) {
                        TelehealthService.GetPatientDetails(user.UID, headers).then(function(response) {
                            if (response.getCode() == 202) {
                                res.set("newtoken", response.getHeaders().newtoken ? response.getHeaders().newtoken : null);
                                req.session.passport.user.SecretKey = response.getHeaders().newsecret ? response.getHeaders().newsecret : null;
                                req.session.passport.user.SecretCreatedDate = response.getHeaders().newsecretcreateddate ? response.getHeaders().newsecretcreateddate : null;
                                req.session.passport.user.TokenExpired = response.getHeaders().tokenexpired ? response.getHeaders().tokenexpired : null;
                                req.session.passport.user.MaxExpiredDate = response.getHeaders().maxexpireddate ? response.getHeaders().maxexpireddate : null;
                            }
                            return res.ok(response.getBody());
                        }, function(err) {
                            res.json(err.getCode(), err.getBody());
                        });
                    } else {
                        var err = new Error("Telehealth.GetUserDetails.Error");
                        err.pushError("User Is Not Exist");
                        return res.serverError(ErrorWrap(err));
                    }
                })
            } else {
                var err = new Error("Telehealth.GetUserDetails.Error");
                err.pushError("User Is Not Exist");
                return res.serverError(ErrorWrap(err));
            }
        })
    },
    GetUserAppointments: function(req, res) {
        var params = req.params.all();
        if (!params.uid) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var patientUID = params.uid;
        var limit = params.limit;
        var type = params.type;
        var headers = req.headers;
        TelehealthService.GetAppointmentsByPatient(patientUID, limit, type, headers).then(function(response) {
            if (response.getCode() == 202) {
                res.set("newtoken", response.getHeaders().newtoken ? response.getHeaders().newtoken : null);
                req.session.passport.user.SecretKey = response.getHeaders().newsecret ? response.getHeaders().newsecret : null;
                req.session.passport.user.SecretCreatedDate = response.getHeaders().newsecretcreateddate ? response.getHeaders().newsecretcreateddate : null;
                req.session.passport.user.TokenExpired = response.getHeaders().tokenexpired ? response.getHeaders().tokenexpired : null;
                req.session.passport.user.MaxExpiredDate = response.getHeaders().maxexpireddate ? response.getHeaders().maxexpireddate : null;
            }
            return res.ok(response.getBody());
        }, function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    GetTelehealthAppointmentDetails: function(req, res) {
        var params = req.params.all();
        if (!params.uid) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var apptUID = params.uid;
        var headers = req.headers;
        if (!apptUID) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.GetTelehealthAppointmentDetails(apptUID, headers).then(function(response) {
            if (response.getCode() == 202) {
                res.set("newtoken", response.getHeaders().newtoken ? response.getHeaders().newtoken : null);
                req.session.passport.user.SecretKey = response.getHeaders().newsecret ? response.getHeaders().newsecret : null;
                req.session.passport.user.SecretCreatedDate = response.getHeaders().newsecretcreateddate ? response.getHeaders().newsecretcreateddate : null;
                req.session.passport.user.TokenExpired = response.getHeaders().tokenexpired ? response.getHeaders().tokenexpired : null;
                req.session.passport.user.MaxExpiredDate = response.getHeaders().maxexpireddate ? response.getHeaders().maxexpireddate : null;
            }
            return res.ok(response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    GetWAAppointmentDetails: function(req, res) {
        var params = req.params.all();
        if (!params.uid) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var apptUID = params.uid;
        var headers = req.headers;
        if (!apptUID) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.GetWAAppointmentDetails(apptUID, headers).then(function(response) {
            if (response.getCode() == 202) {
                res.set("newtoken", response.getHeaders().newtoken ? response.getHeaders().newtoken : null);
                req.session.passport.user.SecretKey = response.getHeaders().newsecret ? response.getHeaders().newsecret : null;
                req.session.passport.user.SecretCreatedDate = response.getHeaders().newsecretcreateddate ? response.getHeaders().newsecretcreateddate : null;
                req.session.passport.user.TokenExpired = response.getHeaders().tokenexpired ? response.getHeaders().tokenexpired : null;
                req.session.passport.user.MaxExpiredDate = response.getHeaders().maxexpireddate ? response.getHeaders().maxexpireddate : null;
            }
            return res.ok(response.getBody());
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
        var deviceType = req.headers.systemtype;
        passport.authenticate('local', function(err, u, info) {
            if ((err) || (!u)) {
                if (!err) var err = info;
                return res.unauthorize(err);
            }
            req.logIn(u.sessionUser, function(err) {
                if (err) res.unauthorize(err);
                else {
                    if (!deviceType || !deviceId || HelperService.const.systemType[deviceType.toLowerCase()] == undefined) {
                        var err = new Error("TelehealthLogin");
                        err.pushError("Invalid Params");
                        return res.serverError(ErrorWrap(err));
                    }
                    res.ok({
                        status: 'success',
                        message: info.message,
                        user: u.user,
                        token: u.token
                    });
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
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;
        var deviceToken = info.devicetoken;
        var uid = info.uid;
        if (deviceToken && uid && deviceType && deviceId && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                TelehealthDevice.findOrCreate({
                    where: {
                        TelehealthUserID: teleUser.ID,
                        DeviceID: deviceId,
                        Type: HelperService.const.systemType[deviceType.toLowerCase()]
                    },
                    defaults: {
                        UID: UUIDService.GenerateUUID(),
                        DeviceToken: deviceToken
                    }
                }).spread(function(device, created) {
                    device.update({
                        DeviceToken: !created ? deviceToken : device.DeviceToken
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
        var deviceType = req.headers.systemtype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
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
                        },
                        headers: {
                            'DeviceID': req.headers.deviceid,
                            'SystemType': HelperService.const.systemType[deviceType.toLowerCase()]
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
        var deviceType = req.headers.systemtype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && verifyCode && deviceId && deviceType && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
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
                                },
                                headers: {
                                    'DeviceID': req.headers.deviceid,
                                    'SystemType': HelperService.const.systemType[deviceType.toLowerCase()]
                                }
                            }).then(function(response) {
                                var data = response.getBody();
                                var activationInfo = {
                                    userUID: user.UID,
                                    verifyCode: data.VerificationToken,
                                    patientUID: patient.UID
                                }
                                req.body.activationInfo = activationInfo;
                                req.body.username = 1;
                                req.body.password = 2;
                                passport.authenticate('local', function(err, u, info) {
                                    if ((err) || (!u)) {
                                        if (!err) var err = info;
                                        return res.unauthorize(err);
                                    }
                                    req.logIn(u.sessionUser, function(err) {
                                        if (err) res.unauthorize(err);
                                        else {
                                            if (!deviceType || !deviceId || HelperService.const.systemType[deviceType.toLowerCase()] == undefined) {
                                                var err = new Error("TelehealthLogin");
                                                err.pushError("Invalid Params");
                                                return res.serverError(ErrorWrap(err));
                                            }
                                            res.ok({
                                                status: 'success',
                                                message: info.message,
                                                user: u.user,
                                                token: u.token
                                            });
                                        }
                                    });
                                })(req, res);
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