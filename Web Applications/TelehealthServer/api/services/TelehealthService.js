var requestify = require('requestify');
var config = sails.config.myconf;
var appts = [];

function checkOnlineUser() {
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
    GetAppointmentList: function() {
        return TelehealthService.MakeRequest({
            path: '/api/appointment-telehealth-list',
            method: 'POST',
            body: {
                data: {
                    Filter: [{
                        Appointment: {
                            FromTime: sails.moment().format('YYYY-MM-DD'),
                            status: "Approved"
                        }
                    }]
                }
            }
        });
    },
    GetOnlineUsers: function() {
        appts = [];
        TelehealthService.GetAppointmentList().then(function(response) {
            appts = response.getBody();
            if (appts.length > 0) {
                TelehealthUser.findAll().then(function(teleUsers) {
                    for (var i = 0; i < teleUsers.length; i++) {
                        for (var j = 0; j < appts.length; j++) {
                            if (teleUsers[i].userAccountID == appts[j].Patients[0].UserAccount.ID) {
                                appts[j].IsOnline = 0;
                                appts[j].TeleUID = teleUsers[i].UID;
                            }
                        }
                    }
                    checkOnlineUser();
                }).catch(function(err) {
                    console.log(err);
                })
            }
            else checkOnlineUser();
        }).catch(function(err) {
            checkOnlineUser();
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