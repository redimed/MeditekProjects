var requestify = require('requestify');
var config = sails.config.myconf;

function checkOnlineUser(appts) {
    var list = sails.sockets.rooms();
    if (appts.length > 0 && list.length > 0) {
        for (var j = 0; j < appts.length; j++) {
            var appt = appts[j];
            appt.IsOnline = 0;
            for (var i = 0; i < list.length; i++) {
                if (appt.TeleUID == list[i]) appt.IsOnline = 1;
            }
        }
    }
    sails.sockets.blast('online_users', appts);
}
module.exports = {
    FindByUID: function(uid) {
        return TelehealthUser.find({
            where: {
                UID: uid
            }
        });
    },
    GetAppointmentsByPatient: function(patientUID, limit) {
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-list',
            method: 'POST',
            body: {
                data: {
                    Order: [{
                        Appointment: {
                            FromTime: 'DESC'
                        }
                    }],
                    Filter: [{
                        Appointment: {
                            Status: "Approved",
                            Enable: "Y"
                        }
                    }, {
                        Patient: {
                            UID: patientUID
                        }
                    }],
                    Limit: limit
                }
            }
        })
    },
    GetAppointmentDetails: function(apptUID) {
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-detail/' + apptUID,
            method: 'GET',
            body: {}
        })
    },
    GetAppointmentList: function() {
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-list',
            method: 'POST',
            body: {
                data: {
                    Order: [{
                        Appointment: {
                            FromTime: 'DESC'
                        }
                    }],
                    Filter: [{
                        Appointment: {
                            FromTime: sails.moment().format('YYYY-MM-DD ZZ'),
                            Status: "Approved",
                            Enable: "Y"
                        }
                    }]
                }
            }
        });
    },
    GetOnlineUsers: function() {
        var appts = [];
        TelehealthService.GetAppointmentList().then(function(response) {
            var data = response.getBody();
            if (data.count > 0) {
                appts = data.rows;
                TelehealthUser.findAll().then(function(teleUsers) {
                    for (var i = 0; i < teleUsers.length; i++) {
                        for (var j = 0; j < appts.length; j++) {
                            if(appts[j].Patients.length > 0 && appts[j].Patients[0].UserAccount){
                                if (teleUsers[i].userAccountID == appts[j].Patients[0].UserAccount.ID) {
                                    appts[j].IsOnline = 0;
                                    appts[j].TeleUID = teleUsers[i].UID;
                                }
                            }
                        }
                    }
                    checkOnlineUser(appts);
                }).catch(function(err) {
                    console.log(err);
                })
            } else checkOnlineUser(appts);
        }).catch(function(err) {
            checkOnlineUser(appts);
        })
    },
    MakeRequest: function(info) {
        return requestify.request(config.CoreAPI + info.path, {
            method: info.method,
            body: info.body,
            timeout: 1000,
            dataType: 'json'
        })
    }
}