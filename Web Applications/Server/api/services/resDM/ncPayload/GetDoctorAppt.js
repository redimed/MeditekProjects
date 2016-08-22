var dmUtils = require('../../resDM/dmUtils');
dmLog = dmUtils.dmLog;
module.exports = function(req, res) {
    try {
        var error = new Error('GetApptDoctors.Error');
        var dmObj = req.dmObj;
        var userActive = req.user;
        var whereClause = {
            Appointment: {}
        };
        whereClause.Appointment.UID = dmObj.apptUID;

        if (_.isEmpty(whereClause.Appointment)) {
            error.pushError('whereClause.Appointment.null');
            throw error;
        };
        return Appointment.findOne({
            include: [{
                model: Doctor,
                attributes: ['UID', 'FirstName', 'LastName', 'Type'],
                include: [{
                    model: UserAccount,
                    attributes: ['UID', 'UserName', 'Email', 'PhoneNumber']
                }]
            }],
            where: whereClause.Appointment
        }).then(function(appt) {
            if (appt) {
                var payloads = [];
                for (var i = 0; i < appt.Doctors.length; i++) {
                    var doctor = appt.Doctors[i];
                    var userAccount = appt.Doctors[i].UserAccount;
                    var appointment = appt;
                    if (doctor && userAccount) {
                        var payload = {
                            Receiver: userAccount.UID,
                            ReceiverType: 'USER_ACCOUNT',
                            ReceiverUID: userAccount.UID,
                            Queue: 'NOTIFY',
                            Read: 'N',
                            MsgContentType: 'JSON',
                            MsgContent: {
                                //Display
                                Display: {
                                    FirstName: doctor.FirstName,
                                    LastName: doctor.LastName,
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
                            EventName: 'privatenofify',
                            SendFromServer: dmUtils.currentServer,
                            Enable: 'Y',
                            Subject: dmObj.Action,
                            FirstDelay : 0,
                        };
                        payloads.push(payload);
                    }
                }
                if (payloads.length > 0) {
                    return payloads;
                } else {
                    error.pushError("Doctors.null");
                    throw error;
                };
            }
        }, function(err) {
            throw err;
        });
    } catch (err) {
        dmLog("GetUserByRole ", err);
    }
}
