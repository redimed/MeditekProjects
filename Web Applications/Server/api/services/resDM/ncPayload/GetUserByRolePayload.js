var dmUtils = require('../../resDM/dmUtils');
dmLog = dmUtils.dmLog;
module.exports = function(req, res) {
    try {
        var error = new Error('GetUserByRole.Error');
        var dmObj = req.dmObj;
        var userActive = req.user;
        // dmLog("GetUserByRole ");
        dmLog("typeof", typeof dmObj.apptUID);
        dmLog("dmObj.apptUID", dmObj.apptUID);
        if (typeof dmObj.apptUID === 'string' || (typeof dmObj.apptUID === 'object' && dmObj.apptUID.length === 1)) {
            dmLog(" Appointment Patient ||||||||||||||||||||||");
            var whereClause = {
                Appointment: {}
            };
            // whereClause.Role.RoleCode = dmObj.RoleCode;
            if (typeof dmObj.apptUID === "object" && dmObj.apptUID.length === 1) {
                whereClause.Appointment.UID = dmObj.apptUID[0].appointment.UID;
            } else {
                whereClause.Appointment.UID = dmObj.apptUID;
            };
            console.log("|||||| GetUserByRole ||||||||||||||||||||||||||||||");
            // if (_.isEmpty(whereClause.Role)) {
            //     error.pushError('whereClause.null');
            //     throw error;
            // };
            return Appointment.findOne({
                where: whereClause.Appointment
            }).then(function(appt) {
                if (appt) {
                    var payloads = [];

                    var payload = {
                        Receiver: dmObj.RoleCode,
                        ReceiverType: dmObj.RoleCode,
                        Queue: 'GLOBALNOTIFY',
                        Read: '',
                        MsgContentType: 'JSON',
                        MsgContent: {
                            //Display
                            Display: {
                                FirstName: '',
                                LastName: '',
                                Subject: userActive.UserName,
                                Action: dmObj.Action,
                                Object: {
                                    name: appt.Code,
                                    UID: appt.UID,
                                }
                            },
                            Command: {
                                Note: dmObj.Message,
                                Url_State: dmObj.Url_State,
                                Url_Redirect: dmObj.Url_Redirect,
                                // Fun : {}
                            }
                        },
                        MsgKind: 'Reference',
                        SenderType: dmUtils.ncSenderType.SERVER,
                        SenderUID: userActive.UID,
                        EventName: 'globalnotify',
                        SendFromServer: dmUtils.currentServer,
                        Enable: 'Y',
                        Subject: dmObj.Action,
                        FirstDelay : 0,
                    };
                    payloads.push(payload);
                    if (payloads) {
                        return payloads;
                    };
                }
            }, function(err) {
                throw err;
            });
        } else {
            dmLog(" Appointment Company ||||||||||||||||||||||");
            var whereClause = {
                UserAccount: {}
            };
            whereClause.Role.RoleCode = dmObj.RoleCode;
            whereClause.UserAccount.UID = userActive.UID;
            return UserAccount.findOne({
                where: whereClause.UserAccount,
                include: [{
                    model: Company,
                    attributes: ['UID', 'CompanyName']
                }]
            }).then(function(usercom) {
                if (usercom) {
                    var payloads = [];

                    var payload = {
                        Receiver: dmObj.RoleCode,
                        ReceiverType: dmObj.RoleCode,
                        Queue: 'GLOBALNOTIFY',
                        Read: '',
                        MsgContentType: 'JSON',
                        MsgContent: {
                            //Display
                            Display: {
                                FirstName: '',
                                LastName: '',
                                Subject: userActive.UserName,
                                Action: dmObj.Action,
                                Object: {
                                    name: usercom.CompanyName,
                                    UID: usercom.UID,
                                },
                                Display: userActive.UserName + ' ' + dmObj.Action + ' for ' + appt.Code
                            },
                            Command: {
                                Note: dmObj.Message
                                    // Url_State: dmObj.Url_State,
                                    // Url_Redirect: dmObj.Url_Redirect,
                                    // Action : {}
                            }
                        },
                        MsgKind: 'Reference',
                        SenderType: dmUtils.ncSenderType.SERVER,
                        SenderUID: userActive.UID,
                        EventName: 'notification',
                        SendFromServer: dmUtils.currentServer,
                        Enable: 'Y',
                        Subject: dmObj.Action,
                        FirstDelay : 0,
                    };
                    payloads.push(payload);
                    if (payloads) {
                        return payloads;
                    };
                }
            }, function(err) {
                throw err;
            });
        };
    } catch (err) {
        dmLog("GetUserByRole ", err);
    }
}
