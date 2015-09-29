var bcrypt = require('bcryptjs');
var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
//****Check and parse string to JSON object also lower case all keys******
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
    TelehealthLogin: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            res.json(500, {
                status: 'error',
                message: 'Invalid Parameters!'
            });
            return;
        }
        var info = toJson(req.body.data);
        var username = typeof info.username != 'undefined' ? info.username : null;
        var password = typeof info.password != 'undefined' ? info.password : null;
        if(username == null || password == null){
             res.json(500, {
                status: 'error',
                message: 'Invalid Parameters!'
            });
            return;
        }
        UserAccount.find({
            where: {
                userName: {
                    $like: username.indexOf('@') > -1 ? '%' : username
                },
                email: {
                    $like: username.indexOf('@') > -1 ? username : '%'
                }
            }
        }).then(function(user) {
            if (user) {
                bcrypt.compare(password.toString(), user.password, function(err, check) {
                    if (check) {
                        user.getDoctor().then(function(doctor) {
                            if (doctor) {
                                user.dataValues.Doctor = doctor;
                                res.json(200, {
                                    status: 'success',
                                    data: user
                                })
                            } else res.json(500, {
                                status: 'error',
                                message: 'Wrong Username Or Password!'
                            })
                        }).catch(function(err) {
                            res.json(500, {
                                status: 'error',
                                message: err
                            });
                        })
                    } else res.json(500, {
                        status: 'error',
                        message: 'Wrong Username Or Password!'
                    })
                });
            } else res.json(500, {
                status: 'error',
                message: 'User Is Not Exist!'
            })
        }).catch(function(err) {
            res.json(500, {
                status: 'error',
                message: err
            });
        })
    },
    UpdateDeviceToken: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            res.json(500, {
                status: 'error',
                message: 'Invalid Parameters!'
            });
            return;
        }
        var info = toJson(req.body.data);
        var deviceToken = typeof info.devicetoken != 'undefined' ? info.devicetoken : null;
        var deviceId = typeof info.deviceid != 'undefined' ? info.deviceid : null;
        var deviceType = typeof info.devicetype != 'undefined' ? info.devicetype.toLowerCase() : null;
        var userId = typeof info.id != 'undefined' ? info.id : null;
        if (deviceToken != null && userId != null && deviceType != null && deviceId != null) {
            TelehealthUser.find({
                where: {
                    userAccountID: userId
                }
            }).then(function(teleUser) {
                TelehealthDevice.findOrCreate({
                    where: {
                        telehealthUserID: teleUser.ID,
                        deviceId: deviceId,
                        type: deviceType
                    },
                    defaults: {
                        UID: config.GenerateUUID(),
                        deviceToken: deviceToken
                    }
                }).spread(function(device, created) {
                    device.update({
                        deviceToken: !created ? deviceToken : device.deviceToken
                    }).then(function() {
                        res.json(200, {
                            status: 'success',
                            message: 'Success!'
                        })
                    }).catch(function(err) {
                        res.json(500, {
                            status: 'error',
                            message: err
                        });
                    })
                })
            })
        } else res.json(500, {
            status: 'error',
            message: 'Invalid Parameters!'
        })
    },
    RequestActivationCode: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            res.json(500, {
                status: 'error',
                message: 'Invalid Parameters!'
            });
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
            }, {
                raw: true
            }).then(function(user) {
                if (user) {
                    UserActivation.findOrCreate({
                        where: {
                            userAccountID: user.ID,
                            type: deviceType,
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
                                    sails.log.error("=====SMS Error=====: ", err);
                                    res.json(500, {
                                        status: 'error',
                                        message: 'Error!'
                                    });
                                    return;
                                }
                                res.json(200, {
                                    status: 'success',
                                    message: 'Request Verification Code Successfully!'
                                });
                            });
                        }).catch(function(err) {
                            res.json(500, {
                                status: 'error',
                                message: err
                            });
                        })
                    }).catch(function(err) {
                        res.json(500, {
                            status: 'error',
                            message: err
                        });
                    })
                } else res.json(500, {
                    status: 'error',
                    message: 'User Is Not Exist!'
                })
            }).catch(function(err) {
                res.json(500, {
                    status: 'error',
                    message: err
                });
            })
        } else res.json(500, {
            status: 'error',
            message: 'Invalid Parameters!'
        })
    },
    VerifyActivationCode: function(req, res) {
        if (typeof req.body.data == 'undefined' || !toJson(req.body.data)) {
            res.json(500, {
                status: 'error',
                message: 'Invalid Parameters!'
            });
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
                    type: deviceType
                }
            }).then(function(userActivate) {
                if (userActivate) {
                    TelehealthUser.findOrCreate({
                        where: {
                            userAccountID: userActivate.userAccountID
                        },
                        defaults: {
                            UID: config.GenerateUUID()
                        }
                    }).spread(function(teleUser, created) {
                        teleUser.getUserAccount({
                            attributes: ['ID', 'userName', 'email', 'phoneNumber']
                        }).then(function(user) {
                            res.json(200, {
                                status: 'success',
                                message: 'User Activated!',
                                data: user
                            })
                        }).catch(function(err) {
                            res.json(500, {
                                status: 'error',
                                message: err
                            });
                        })
                    }).catch(function(err) {
                        res.json(500, {
                            status: 'error',
                            message: err
                        });
                    })
                } else res.json(500, {
                    status: 'error',
                    message: 'Invalid Code!'
                })
            }).catch(function(err) {
                res.json(500, {
                    status: 'error',
                    message: err
                });
            })
        } else res.json(500, {
            status: 'error',
            message: 'Invalid Parameters!'
        })
    }
}