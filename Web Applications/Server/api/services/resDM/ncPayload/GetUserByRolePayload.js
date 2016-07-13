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
                Role: {},
                Appointment: {}
            };
            whereClause.Role.RoleCode = dmObj.RoleCode;
            if (typeof dmObj.apptUID === "object" && dmObj.apptUID.length === 1) {
                whereClause.Appointment.UID = dmObj.apptUID[0].appointment.UID;
            } else {
                whereClause.Appointment.UID = dmObj.apptUID;
            };
            console.log("|||||| GetUserByRole ||||||||||||||||||||||||||||||");
            if (_.isEmpty(whereClause.Role)) {
                error.pushError('whereClause.null');
                throw error;
            };
            return Appointment.findOne({
                where: whereClause.Appointment
            }).then(function(appt) {
                if (appt) {
                    return UserAccount.findAll({
                        attributes: ['ID', 'UID', 'UserName'],
                        include: [{
                            model: Role,
                            attributes: ['ID', 'UID'],
                            where: whereClause.Role
                        }]
                    }).then(function(result) {
                        var payloads = [];
                        result.forEach(function(User, index) {
                            var payload = {
                                Receiver: User.UID,
                                ReceiverType: dmObj.ReceiverType,
                                ReceiverUID: User.UID,
                                Queue: 'NOTIFY',
                                Read: 'N',
                                MsgContentType: 'JSON',
                                MsgContent: {
                                    //Display
                                    Display: {
                                        Subject: userActive.UserName,
                                        Action: dmObj.Action,
                                        Object: {
                                            name: appt.Code,
                                            UID: appt.UID,
                                        },
                                        Display: userActive.UserName + ' ' + dmObj.Action + ' ' + appt.Code
                                    },
                                    Command: {
                                        Note: dmObj.Message,
                                        Url_State: dmObj.Url_State,
                                        Url_Redirect: dmObj.Url_Redirect,
                                        // Action : {}
                                    }
                                },
                                MsgKind: 'Reference',
                                SenderType: dmUtils.ncSenderType.SERVER,
                                SenderUID: userActive.UID,
                                EventName: 'notification',
                                SendFromServer: dmUtils.currentServer,
                            };
                            payloads.push(payload);
                        });
                        console.log("4444444444444444444 ", payloads.length);
                        if (payloads.length > 0) {
                            console.log("55555555555555555555 ", payloads.length);
                            return payloads;
                        } else {
                            error.pushError("payloads.null");
                            throw error;
                        };
                    });
                }
            }, function(err) {
                throw err;
            });
        } else {
            dmLog(" Appointment Company ||||||||||||||||||||||");
            var whereClause = {
                Role: {},
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
                    return UserAccount.findAll({
                        attributes: ['ID', 'UID', 'UserName'],
                        include: [{
                            model: Role,
                            attributes: ['ID', 'UID'],
                            where: whereClause.Role
                        }]
                    }).then(function(result) {
                        var payloads = [];
                        result.forEach(function(User, index) {
                            var payload = {
                                Receiver: User.UID,
                                ReceiverType: dmObj.ReceiverType,
                                ReceiverUID: User.UID,
                                Queue: 'NOTIFY',
                                Read: 'N',
                                MsgContentType: 'JSON',
                                MsgContent: {
                                    //Display
                                    Display: {
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
                            };
                            payloads.push(payload);
                        });
                        console.log("4444444444444444444 ", payloads.length);
                        if (payloads.length > 0) {
                            console.log("55555555555555555555 ", payloads.length);
                            return payloads;
                        } else {
                            error.pushError("payloads.null");
                            throw error;
                        };
                    });
                }
            }, function(err) {
                throw err;
            });
        };
    } catch (err) {
        dmLog("GetUserByRole ", err);
    }
}
