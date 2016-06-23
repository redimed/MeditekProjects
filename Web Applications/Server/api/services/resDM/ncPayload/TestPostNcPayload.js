/**
 * Created by tannguyen on 23/06/2016.
 */
var $q = require('q');
var dmUtils = require('../dmUtils.js');
module.exports = function (req, res) {
    var error = new Error("TestPostNcPayload.Error");
    var q = $q.defer();
    var dmObj = req.dmObj;
    if(req.dmObj && req.dmObj.apptUID) {
        return Appointment.findOne({
            attributes: ['UID'],
            include: [
                {
                    model: Doctor,
                    attributes: ['UID', 'FirstName', 'LastName', 'Type', 'Email'],
                    include: [
                        {
                            model: UserAccount,
                            attributes: ['UID', 'UserName', 'Email', 'PhoneNumber']
                        }
                    ]
                }
            ],
            where: {
              UID: req.dmObj.apptUID
            }
        })
        .then(function(appt){
            if (appt) {
                var payloads = [];
                for (var i = 0; i < appt.Doctors.length; i++) {
                    // console.log(appt.Doctors[i].dataValues);
                    var doctor = appt.Doctors[i];
                    var userAccount = appt.Doctors[i].UserAccount;
                    var appointment = appt;
                    if(doctor && userAccount)
                    {
                        var payload = {
                            Receiver: doctor.Email,
                            ReceiverType: 'USER_ACCOUNT',
                            ReceiverUID: userAccount.UID,
                            Queue: 'EMAIL',
                            MsgContent:'Test notification center',
                            EventName: 'EMAIL',
                            SendFromServer: dmUtils.currentServer,
                            SenderType: dmUtils.ncSenderType.SERVER,
                            Subject: 'Update appointment email notify'
                        };
                        payloads.push(payload);
                    }
                }
                if (payloads.length > 0) {
                    return payloads;
                } else {
                    error.pushError("appointment.null");
                    throw error;
                }

            } else {
                error.pushError('data.null');
                throw error;
            }
        },function(err){
            throw err;
        })

    }
}
