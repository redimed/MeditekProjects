var dmUtils = require('../../resDM/dmUtils');
dmLog = dmUtils.dmLog;
module.exports = function(req, res) {
    try {
        var error = new Error('GetUserByRole.Error');
        var dmObj = req.dmObj;
        // dmLog("GetUserByRole ");
        var whereClause = {
            Role: {},
            Appointment: {}
        };
        whereClause.Role.RoleCode = dmObj.RoleCode;
        whereClause.Appointment.UID = dmObj.apptUID;
        console.log("GetUserByRole ", whereClause);
        if (_.isEmpty(whereClause.Role)) {
            error.pushError('whereClause.null');
            throw error;
        };

        console.log("11111111111 ", whereClause);
        return Appointment.findOne({
            where: whereClause.Appointment
        }).then(function(appt) {
            console.log("2222222222222222222 ");
            if (appt) {
                console.log("3333333333333333333 ");
                return UserAccount.findAll({
                    attributes: ['ID', 'UID'],
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
                            ReceiverType: 'ALL_ADMINS',
                            ReceiverUID: User.UID,
                            Queue: 'NOTIFY',
                            Read: 'N',
                            MsgContent: {
                                action: 'Link Patient',
                                Appointment: appt,
                                sender: req.user,
                            },
                            MsgContentType: 'JSON',
                            EventName: 'notification',
                            SendFromServer: dmUtils.currentServer,
                            SenderType: dmUtils.ncSenderType.SERVER,
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
    } catch (err) {
        dmLog("GetUserByRole ", err);
    }
}
