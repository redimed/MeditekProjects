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

function pushGCMNotification(info, devices, gcmSender) {
    var androidMess = {
        collapseKey: 'REDiMED',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data: info.data ? info.data : {},
        notification: {
            title: "REDiMED",
            icon: "ic_launcher",
            body: info.content ? info.content : 'Push Notification From REDiMED'
        }
    };
    TelehealthService.SendGCMPush(androidMess, devices, gcmSender).then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err);
    })
};

function pushAPNNotification(info, devices) {
    var iosMess = {
        badge: 1,
        alert: info.content ? info.content : 'Push Notification From REDiMED',
        payload: info.data ? info.data : {},
        category: info.category ? info.category : null
    };
    TelehealthService.SendAPNPush(iosMess, devices);
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
                            var data = response.getBody();
                            data.data[0].UserAccount = user.dataValues;
                            return res.ok(data);
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
                console.log("UpdatePatientDetails", response.getBody());
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
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
                console.log("ChangeEnableFile", response.getBody());
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
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
                console.log("GetListDoctor", response.getBody());
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
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
    GetTelehealthUserNew: function(req, res) {
        if (typeof req.body == 'undefined' || !HelperService.toJson(req.body)) {
            var err = new Error("Telehealth.PushNotification.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body);
        var uid = info.uid;
        var headers = req.headers;
        var systemtype = headers.systemtype;
        var appid = headers.appid;
        var deviceType = headers.deviceid;
        var deviceToken = info.token || null;
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
                    if (teleUser) {
                        return TelehealthDevice.findOrCreate({
                            where: {
                                TelehealthUserID: teleUser.ID,
                                Type: systemtype,
                                DeviceType: deviceType,
                                Appid: appid
                            },
                            defaults: {
                                TelehealthUserID: teleUser.ID,
                                UID: UUIDService.Create(),
                                DeviceID: UUIDService.Create(),
                                Type: systemtype,
                                DeviceType: deviceType,
                                Appid: appid
                            }
                        }).spread(function(teleDevice, created) {
                            if (teleDevice) {
                                return teleDevice.update({
                                    DeviceToken: deviceToken
                                }).then(function() {
                                    return TelehealthService.GetPatientDetails(user.UID, headers).then(function(response) {
                                        if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                                        res.ok({
                                            message: "success",
                                            data: {
                                                TelehealthUser: teleUser,
                                                TelehealthDevice: teleDevice,
                                                PatientInfo: response.getBody().data[0]
                                            }
                                        });
                                    }, function(err) {
                                        res.json(err.getCode(), err.getBody());
                                    });
                                }).catch(function(err) {
                                    res.serverError(ErrorWrap(err));
                                })
                            } else {
                                var err = new Error("Telehealth.GetTelehealthUser.Error");
                                err.pushError("Telehealth Device Is Not Exist");
                                return res.serverError(ErrorWrap(err));
                            }
                        });
                    } else {
                        var err = new Error("Telehealth.GetTelehealthUser.Error");
                        err.pushError("Telehealth User Is Not Exist");
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

    Logout: function(req, res) {
        console.log("================================", req.body.data);
        var err = new Error("Telehealth.Logout.Error");
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var uid = info.uid;
        var deviceId = req.headers.deviceid;
        var systemtype = req.headers.systemtype;
        var deviceType = headers.devicetype;
        var roomList = sails.sockets.rooms();
        if (uid && deviceType && deviceId) {
            return TelehealthService.FindByUID(uid).then(function(teleUser) {
                return TelehealthDevice.update({
                    DeviceToken: null
                }, {
                    where: {
                        TelehealthUserID: teleUser.ID,
                        Type: systemtype,
                        DeviceModel: deviceType
                    }
                }).then(function(result) {
                    console.log("111111111111111111111111111111", result);
                    console.log("=============================== Logout roomList", roomList);
                    sails.sockets.leave(req.socket, uid);
                    console.log("=============================== Logout roomList", sails.sockets.rooms());
                    return res.ok({
                        status: "success"
                    });
                }, function(error) {
                    err.pushError("Update Telehealth Device Error");
                    return res.serverError(ErrorWrap(error));
                });
            })
        } else {
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
        var headers = req.headers;
        var appid = headers.appid;
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
            dryRun: false,
            data: {
                "data": data
            },
            notification: {
                title: "REDiMED",
                icon: "ic_launcher",
                body: title ? title : 'Notification From REDiMED',
                sound: "default"
            }
        };
        TelehealthService.FindByUID(uid).then(function(teleUser) {
            if (teleUser) {
                TelehealthDevice.findAll({
                    where: {
                        TelehealthUserID: teleUser.ID,
                        Appid: appid
                    }
                }).then(function(devices) {
                    if (devices) {
                        if (appid == config.WorkinjuryAppid) {
                            var tokens = [];
                            for (var i = 0; i < devices.length; i++) {
                                if (devices[i].DeviceToken != null)
                                    tokens.push(devices[i].DeviceToken);
                            }
                            if (token.length > 0) {
                                TelehealthService.SendGCMPush(androidMess, tokens, config.GCMWorkInjury).then(function(result) {
                                    console.log(result);
                                }).catch(function(err) {
                                    console.log(err);
                                })
                            }
                        } else {
                            var iosDevices = [];
                            var androidDevices = [];
                            for (var i = 0; i < devices.length; i++) {
                                if (devices[i].DeviceToken != null) {
                                    if (devices[i].Type == 'IOS') iosDevices.push(devices[i].DeviceToken);
                                    else androidDevices.push(devices[i].DeviceToken);
                                }
                            }
                            if (iosDevices.length > 0) TelehealthService.SendAPNPush(iosMess, iosDevices);
                            if (androidDevices.length > 0) {
                                TelehealthService.SendGCMPush(androidMess, androidDevices, config.GCMTelehealth).then(function(result) {
                                    console.log(result);
                                }).catch(function(err) {
                                    console.log(err);
                                })
                            }
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
    TestTelehealthPushAPN: function(req, res) {
        var tokens = [];
        var params = req.params.all();
        TelehealthDevice.findAll({
            where: {
                Type: 'IOS',
                Appid: config.TelehealthAppid
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
    TestTelehealthPushGCM: function(req, res) {
        var tokens = [];
        TelehealthDevice.findAll({
            where: {
                Type: 'ARD',
                Appid: config.TelehealthAppid
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
                TelehealthService.SendGCMPush(opts, tokens, config.GCMTelehealth).then(function(result) {
                    res.ok(result);
                }).catch(function(err) {
                    return res.serverError(ErrorWrap(err));
                })
            } else return res.ok({
                msg: 'No Device Found!'
            });
        })
    },
    TestGCM: function(req, res) {
        var params = req.params.all();
        if (!params.device) {
            var err = new Error("Telehealth.TestGCM.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var device = params.device;
        var tokens = [];
        if (device) {
            tokens.push(device);
            var opts = {
                collapseKey: 'demo',
                priority: 'high',
                contentAvailable: true,
                delayWhileIdle: true,
                timeToLive: 3,
                dryRun: false,
                data: {
                    key1: 'message1',
                    key2: 'message2'
                },
                notification: {
                    title: "Redimed",
                    icon: "ic_launcher",
                    body: "Test Push Notification",
                    sound: "default"
                }
            };
            return TelehealthService.SendGCMPush(opts, tokens, config.GCMWorkInjury).then(function(result) {
                res.ok(result);
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        } else return res.ok({
            msg: 'No Device Found!'
        });
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
        var data = {};
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType) {
            return TelehealthService.MakeRequest({
                    host: config.AuthAPI,
                    path: '/api/check-activated',
                    method: 'POST',
                    body: {
                        PhoneNumber: phoneNumber
                    },
                    headers: {
                        'DeviceID': deviceId,
                        'SystemType': deviceType
                    }
                })
                .then(function(response) {
                    data = response.getBody();
                    return TelehealthService.GetPatientDetails(data.UserUID, req.headers)
                })
                .then(function(patientResponse) {
                    if (patientResponse && patientResponse.getBody() && patientResponse.getBody().data.length > 0) {
                        var patientInfo = patientResponse.getBody().data[0];
                        data.PatientUID = patientInfo.UID;
                    }
                    if (data.Activated === "N")
                        return sendSMS(phoneNumber, "Your REDiMED account pin number is " + data.PinNumber)
                    else
                        return null;
                })
                .then(function(mess) {
                    return res.ok(data);
                })
                .catch(function(error) {
                    if (error.getCode) {
                        console.log("Get code ne");
                        res.json(error.getCode(), error.getBody());
                    } else {
                        res.serverError(ErrorWrap(error));
                    }
                })
        } else {
            var err = new Error("Telehealth.Activation.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    CheckActivationNew: function(req, res) {
        console.log("Activation", JSON.stringify(req.body));
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.Activation.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var phoneNumber = info.phone;
        var deviceType = req.headers.systemtype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        var data = {};
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceType) {
            return TelehealthService.MakeRequest({
                host: config.AuthAPI,
                path: '/api/check-activated',
                method: 'POST',
                body: {
                    PhoneNumber: phoneNumber
                },
                headers: {
                    'SystemType': deviceType
                }
            }).then(function(response) {
                var data = response.getBody();
                if (data.Activated === "N") {
                    sendSMS(phoneNumber, "Your REDiMED account pin number is " + data.PinNumber).then(function(mess) {
                        return res.ok(mess);
                    }, function(error) {
                        var err = new Error("Telehealth.Activation.Trello.Error");
                        err.pushError(error);
                        return res.serverError(ErrorWrap(err));
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
    SendCoreServer: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.SendCoreServer.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var path = info.path;
        var method = info.method;
        var body = (info.body) ? info.body : null;
        var headers = req.headers;
        var deviceId = headers.deviceid;
        var deviceType = headers.systemtype;
        if (deviceId && deviceType && path && method) {
            if (body != null) {
                //post
                TelehealthService.PostCoreServer(path, method, body, headers).then(function(response) {
                    if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);

                    return res.ok(response.getBody());
                }).catch(function(err) {
                    res.json(err.getCode(), err.getBody());
                })
            } else {
                //get
                TelehealthService.GetCoreServer(path, method, headers).then(function(response) {
                    if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);

                    return res.ok(response.getBody());
                }).catch(function(err) {
                    res.json(err.getCode(), err.getBody());
                })
            }
        } else {
            var err = new Error("Telehealth.SendCoreServer.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    ForgetPIN: function(req, res) {
        if (typeof req.body == 'undefined' || !HelperService.toJson(req.body)) {
            var err = new Error("Telehealth.ForgetPIN.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body);
        var headers = req.headers;
        var appid = headers.appid;
        var deviceType = headers.deviceid;
        var phoneNumber = info.phone;
        var deviceToken = info.token;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        var gcmSender = (appid == config.WorkinjuryAppid) ? config.GCMWorkInjury : config.GCMTelehealth;
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceToken && deviceType) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    return TelehealthUser.find({
                        where: {
                            UserAccountID: user.ID
                        }
                    }).then(function(teleUser) {
                        if (teleUser) {
                            return TelehealthDevice.find({
                                where: {
                                    TelehealthUserID: teleUser.ID,
                                    DeviceToken: deviceToken,
                                    DeviceType: deviceType
                                }
                            }).then(function(device) {
                                var opts = {
                                    collapseKey: 'REDiMED',
                                    priority: 'high',
                                    contentAvailable: true,
                                    delayWhileIdle: true,
                                    timeToLive: 3,
                                    dryRun: false,
                                    data: {
                                        message: "Pinumber is " + user.PinNumber
                                    },
                                    notification: {
                                        title: "REDiMED",
                                        icon: "ic_launcher",
                                        body: "Push Notification From REDiMED",
                                        sound: "default"
                                    }
                                };
                                var tokens = [];
                                console.log("device", device);
                                if (device) {
                                    console.log("pushhhhhhhhhhhhhhh");
                                    tokens.push(device.DeviceToken);
                                    return TelehealthService.SendGCMPush(opts, tokens, gcmSender).then(function(result) {
                                        console.log("push success", result);
                                        res.ok({ message: "success", data: result });
                                    }).catch(function(err) {
                                        res.serverError(ErrorWrap(err));
                                    })
                                } else {
                                    console.log("senddddddddd");
                                    return sendSMS(phoneNumber, "Your REDiMED account pin number is " + user.PinNumber).then(function(mess) {
                                        res.ok({ status: "Send sms success", data: mess });
                                    }, function(error) {
                                        res.serverError(ErrorWrap(error));
                                    });
                                }
                            })
                        } else {
                            var err = new Error("Telehealth.GetTelehealthUser.Error");
                            err.pushError("ForgetPIN.TelehealthUserIsNotExist");
                            return res.serverError(ErrorWrap(err));
                        }
                    })
                } else {
                    var err = new Error("Telehealth.ForgetPIN.Error");
                    err.pushError("ForgetPIN.UserIsNotExist");
                    return res.serverError(ErrorWrap(err));
                }
            })
        }
    },
    UpdatePinNumber: function(req, res) {
        if (typeof req.body == 'undefined' || !HelperService.toJson(req.body)) {
            var err = new Error("Telehealth.UpdatePinNumber.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body);
        var oldPin = info.oldpin;
        var newPin = info.newpin;
        var headers = req.headers;
        var userUid = headers.useruid;
        if (newPin && (newPin.length == 6) && oldPin && userUid) {
            return UserAccount.find({
                where: {
                    UID: userUid
                }
            }).then(function(user) {
                if (user) {
                    if (user.PinNumber == oldPin) {
                        var body = {
                            data: {
                                PinNumber: newPin,
                                UserAccountID: user.ID
                            }
                        };
                        return TelehealthService.PostCoreServer("/api/patient/update-patient", "POST", body, headers).then(function(response) {
                            if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                            res.ok(response.getBody());
                        }).catch(function(err) {
                            res.json(err.getCode(), err.getBody());
                        })
                    } else {
                        var err = new Error("Telehealth.UpdatePinNumber.Error");
                        err.pushError("Wrong PinNumber");
                        return res.serverError(ErrorWrap(err));
                    }
                } else {
                    var err = new Error("Telehealth.UpdatePinNumber.Error");
                    err.pushError("User Is Not Exist");
                    return res.serverError(ErrorWrap(err));
                }
            });
        } else {
            var err = new Error("Telehealth.UpdatePinNumber.Error");
            if (newPin.length != 6) {
                err.pushError("Incorrect format PIN number");
            } else {
                err.pushError("Invalid Params");
            }
            res.serverError(ErrorWrap(err));
        }
    }
}
