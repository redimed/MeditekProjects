var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = sails.config.myconf;
var _ = require('lodash');
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
    GetPatientDetails: function(req, res) {
        var params = req.params.all();
        if (!params.uid) {
            var err = new Error("Telehealth.GetPatientDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var uid = params.uid;
        var headers = req.headers;
        var deviceType = headers.systemtype;
        if (!uid || !deviceType) {
            var err = new Error("Telehealth.GetPatientDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.FindByUID(uid).then(function(teleUser) {
            if (teleUser) {
                return teleUser.getUserAccount().then(function(user) {
                    if (user) {
                        TelehealthService.GetPatientDetails(user.UID, headers).then(function(response) {
                            if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                            return res.ok(response.getBody());
                        }, function(err) {
                            res.json(err.getCode(), err.getBody());
                        });
                    } else {
                        var err = new Error("Telehealth.GetPatientDetails.Error");
                        err.pushError("User Is Not Exist");
                        return res.serverError(ErrorWrap(err));
                    }
                })
            } else {
                var err = new Error("Telehealth.GetPatientDetails.Error");
                err.pushError("User Is Not Exist");
                return res.serverError(ErrorWrap(err));
            }
        })
    },
    UpdatePatientDetails: function(req, res) {
        var body = req.body;
        var headers = req.headers;
        if (!_.isEmpty(body) &&
            !_.isEmpty(body.data)) {
            TelehealthService.UpdatePatientDetails(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                console.log("UpdatePatientDetails", response.getBody());
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.UpdatePatientDetails.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    ChangeEnableFile: function(req, res) {
        var body = req.body;
        var headers = req.headers;
        if (!_.isEmpty(body) &&
            !_.isEmpty(body.data)) {
            TelehealthService.ChangeEnableFile(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                console.log("ChangeEnableFile", response.getBody());
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.ChangeEnableFile.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    GetListDoctor: function(req, res) {
        var body = req.body;
        var headers = req.headers;
        if (!_.isEmpty(body) &&
            !_.isEmpty(body.data)) {
            TelehealthService.GetListDoctor(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                console.log("GetListDoctor", response.getBody());
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.GetListDoctor.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    GetTelehealthUser: function(req, res) {
        var params = req.params.all();
        if (!params.uid) {
            var err = new Error("Telehealth.GetTelehealthUser.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var uid = params.uid;
        var headers = req.headers;
        var deviceType = headers.systemtype;
        if (!uid || !deviceType) {
            var err = new Error("Telehealth.GetTelehealthUser.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        UserAccount.find({
            where: {
                UID: uid
            }
        }).then(function(user) {
            if (user) {
                return TelehealthUser.findOrCreate({
                    where: {
                        UserAccountID: user.ID
                    },
                    defaults: {
                        UID: UUIDService.Create()
                    }
                }).spread(function(teleUser, created) {
                    if (teleUser) return res.ok(teleUser);
                    else {
                        var err = new Error("Telehealth.GetTelehealthUser.Error");
                        err.pushError("User Is Not Exist");
                        return res.serverError(ErrorWrap(err));
                    }
                }).catch(function(err) {
                    return res.serverError(ErrorWrap(err));
                })
            } else {
                var err = new Error("Telehealth.GetTelehealthUser.Error");
                err.pushError("User Is Not Exist");
                return res.serverError(ErrorWrap(err));
            }
        })
    },
    GetUserAppointments: function(req, res) {
        var body = req.body;
        var headers = req.headers;
        if (!_.isEmpty(body) &&
            !_.isEmpty(body.data)) {
            TelehealthService.GetAppointmentsByPatient(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                console.log("response.getBody()");
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('GetUserAppointments.data.not.exist');
            res.serverError(ErrorWrap(error));
        }
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
            if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
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
            if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);

            return res.ok(response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    GetListCountry: function(req, res) {
        var headers = req.headers;
        TelehealthService.GetListCountry(headers).then(function(response) {
            if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
            var data = [];
            _.forEach(response.getBody().data, function(value, key) {
                data.push(value.ShortName);
            });
            return res.ok({ data: data });
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },

    //khong xai nua
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
        var deviceToken = info.token || null;
        var uid = info.uid;
        if (uid && deviceType && deviceId) {
            return TelehealthService.FindByUID(uid).then(function(teleUser) {
                return TelehealthDevice.findOrCreate({
                    where: {
                        TelehealthUserID: teleUser.ID,
                        DeviceID: deviceId,
                        Type: deviceType
                    },
                    defaults: {
                        UID: UUIDService.Create(),
                        DeviceToken: deviceToken
                    }
                }).spread(function(device, created) {
                    return device.update({
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
    //khong xai nua
    Logout: function(req, res) {
        console.log("================================", req.body.data);
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.Logout.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;
        var deviceToken = info.token || null;
        var uid = info.uid;
        if (uid && deviceType && deviceId) {
            console.log("+++++++++++++++++++++++++++++++++++++", uid, deviceType, deviceId, deviceToken);
            return TelehealthService.FindByUID(uid).then(function(teleUser) {
                return TelehealthDevice.findOrCreate({
                    where: {
                        TelehealthUserID: teleUser.ID,
                        DeviceID: deviceId,
                        Type: deviceType
                    },
                    defaults: {
                        UID: UUIDService.Create(),
                        DeviceToken: deviceToken
                    }
                }).spread(function(device, created) {
                    console.log("neeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", device);
                    return device.update({
                        DeviceToken: null
                    }).then(function() {
                        return TelehealthService.MakeRequest({
                            host: config.AuthAPI,
                            path: '/api/logout',
                            method: 'GET',
                            headers: req.headers
                        }).then(function(response) {
                            res.ok({
                                status: 'success',
                                message: 'Success!'
                            })
                        }).catch(function(err) {
                            res.serverError(err.getBody());
                        });
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                })
            })
        } else {
            var err = new Error("Telehealth.Logout.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    //khong xai nua
    RequestActivationCode: function(req, res) {
        console.log("RequestActivationCode", JSON.stringify(req.body));
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
        console.log("====================================");
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    return TelehealthService.MakeRequest({
                        host: config.AuthAPI,
                        path: '/api/user-activation/create-user-activation',
                        method: 'POST',
                        body: {
                            UserUID: user.UID,
                            Type: deviceType,
                            DeviceID: deviceId,
                            AppID: req.headers.appid
                        },
                        headers: {
                            'DeviceID': req.headers.deviceid,
                            'SystemType': deviceType,
                            'AppID': req.headers.appid
                        }
                    }).then(function(response) {
                        var data = response.getBody();
                        sendSMS(phoneNumber, "Your REDiMED account verification code is " + data.VerificationCode).then(function(mess) {
                            return res.ok({
                                status: 'success',
                                message: 'Request Verification Code Successfully!'
                            });
                        }, function(error) {
                            console.log("111111111111");
                            return res.serverError(ErrorWrap(error));
                        });
                    }).catch(function(err) {
                        console.log("222222222");
                        res.serverError(err.getBody());
                    })
                } else {
                    console.log("3333333333");
                    var err = new Error("Telehealth.RequestActivationCode.Error");
                    err.pushError("User Is Not Exist");
                    res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                console.log("444444444444");
                res.serverError(ErrorWrap(err));
            })
        } else {
            console.log("555555555");
            var err = new Error("Telehealth.RequestActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    //khong xai nua
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
        if (phoneNumber && phoneNumber.match(phoneRegex) && verifyCode && deviceId && deviceType) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    return user.getPatient().then(function(patient) {
                        if (patient) {
                            TelehealthService.MakeRequest({
                                host: config.AuthAPI,
                                path: '/api/user-activation/activation',
                                method: 'GET',
                                params: {
                                    UserUID: user.UID,
                                    SystemType: deviceType,
                                    DeviceID: deviceId,
                                    AppID: req.headers.appid,
                                    VerificationCode: verifyCode
                                },
                                headers: {
                                    'DeviceID': req.headers.deviceid,
                                    'SystemType': deviceType,
                                    'AppID': req.headers.appid
                                }
                            }).then(function(response) {
                                var data = response.getBody();
                                var activationInfo = {
                                    userUID: user.UID,
                                    verifyCode: data.VerificationToken,
                                    patientUID: patient.UID
                                }
                                return res.ok(activationInfo);
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
    },
    PushNotification: function(req, res) {
        if (typeof req.body == 'undefined' || !HelperService.toJson(req.body)) {
            var err = new Error("Telehealth.PushNotification.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body);
        var data = info.data;
        var sound = info.sound;
        var title = info.title;
        var category = info.category;
        var badge = info.badge;
        var uid = info.uid;
        if (!uid || !data) {
            var err = new Error("Telehealth.PushNotification.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var iosMess = {
            badge: badge || 0,
            alert: title ? title : 'Notification From REDiMED',
            payload: {
                "data": data
            },
            sound: sound ? sound : null,
            category: category ? category : null
        };
        var androidMess = {
            collapseKey: 'REDiMED',
            priority: 'high',
            contentAvailable: true,
            delayWhileIdle: true,
            timeToLive: 3,
            data: {
                "data": data
            },
            notification: {
                title: "REDiMED",
                icon: "ic_launcher",
                body: title ? title : 'Notification From REDiMED'
            }
        };
        TelehealthService.FindByUID(uid).then(function(teleUser) {
            if (teleUser) {
                TelehealthDevice.findAll({
                    where: {
                        TelehealthUserID: teleUser.ID
                    }
                }).then(function(devices) {
                    var iosDevices = [];
                    var androidDevices = [];
                    if (devices) {
                        for (var i = 0; i < devices.length; i++) {
                            if (devices[i].Type == 'IOS') iosDevices.push(devices[i].DeviceToken);
                            else androidDevices.push(devices[i].DeviceToken);
                        }
                        if (iosDevices.length > 0) TelehealthService.SendAPNPush(iosMess, iosDevices);
                        if (androidDevices.length > 0) {
                            TelehealthService.SendGCMPush(androidMess, androidDevices).then(function(result) {
                                console.log(result);
                            }).catch(function(err) {
                                console.log(err);
                            })
                        }
                        return res.ok({
                            status: 'success'
                        });
                    } else {
                        var err = new Error("Telehealth.PushNotification.Error");
                        err.pushError("No Devices Was Found");
                        return res.serverError(ErrorWrap(err));
                    }
                })
            } else {
                var err = new Error("Telehealth.PushNotification.Error");
                err.pushError("User Not Exist");
                return res.serverError(ErrorWrap(err));
            }
        })
    },
    TestPushAPN: function(req, res) {
        var tokens = [];
        var params = req.params.all();
        TelehealthDevice.findAll({
            where: {
                Type: 'IOS'
            }
        }).then(function(devices) {
            if (devices) {
                for (var i = 0; i < devices.length; i++) {
                    tokens.push(devices[i].DeviceToken);
                }
                var opts = {
                    badge: params.badge,
                    alert: 'Test Push Notification',
                    payload: {
                        "data": {
                            "apiKey": "45364382",
                            "message": "call",
                            "fromName": "",
                            "sessionId": "",
                            "token": "",
                            "from": ""
                        }
                    },
                    category: "CALLING_MESSAGE"
                };
                TelehealthService.SendAPNPush(opts, tokens);
                return res.ok({
                    msg: 'Success'
                });
            } else return res.ok({
                msg: 'No Device Found!'
            });
        })
    },
    TestPushGCM: function(req, res) {
        var tokens = [];
        TelehealthDevice.findAll({
            where: {
                Type: 'ARD'
            }
        }).then(function(devices) {
            if (devices) {
                for (var i = 0; i < devices.length; i++) {
                    tokens.push(devices[i].DeviceToken);
                }
                var opts = {
                    collapseKey: 'demo',
                    priority: 'high',
                    contentAvailable: true,
                    delayWhileIdle: true,
                    timeToLive: 3,
                    data: {
                        "data": {
                            "apiKey": "45364382",
                            "message": "call",
                            "fromName": "",
                            "sessionId": "",
                            "token": "",
                            "from": ""
                        }
                    },
                    notification: {
                        title: "Redimed",
                        icon: "ic_launcher",
                        body: "Test Push Notification"
                    }
                };
                TelehealthService.SendGCMPush(opts, tokens).then(function(result) {
                    res.ok(result);
                }).catch(function(err) {
                    return res.serverError(ErrorWrap(err));
                })
            } else return res.ok({
                msg: 'No Device Found!'
            });
        })
    },
    CheckActivation: function(req, res) {
        console.log("Activation", JSON.stringify(req.body));
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.Activation.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var phoneNumber = info.phone;
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType) {
            return TelehealthService.MakeRequest({
                host: config.AuthAPI,
                path: '/api/check-activated',
                method: 'POST',
                body: {
                    PhoneNumber: phoneNumber
                },
                headers: {
                    'DeviceID': req.headers.deviceid,
                    'SystemType': deviceType,
                    'AppID': req.headers.appid
                }
            }).then(function(response) {
                var data = response.getBody();
                if (data.Activated === "N") {
                    sendSMS(phoneNumber, "Your REDiMED account pin number is " + data.PinNumber).then(function(mess) {
                        return res.ok(data);
                    }, function(error) {
                        return res.serverError(ErrorWrap(error));
                    });
                }
                res.ok(data);
            }).catch(function(err) {
                res.serverError(err.getBody());
            });
        } else {
            var err = new Error("Telehealth.Activation.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
}