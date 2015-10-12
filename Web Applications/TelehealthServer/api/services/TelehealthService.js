var requestify = require('requestify');
var config = sails.config.myconf;
var appts = [];

function checkOnlineUser() {
    var list = sails.sockets.rooms();
    if (appts.length > 0 && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].indexOf(":") != -1) {
                var data = list[i].split(':');
                for (var j = 0; j < appts.length; j++) {
                    var appt = appts[j];
                    if (appt.Patients[0].UserAccount.PhoneNumber == data[1]) {
                        appt.TeleUID = data[0]
                        appt.IsOnline = true;
                    }
                }
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
                            FromTime: "2015-10-10",
                            status: "Approved"
                        }
                    }]
                }
            }
        });
    },
    GetOnlineUsers: function() {
        if (appts.length == 0) {
            TelehealthService.GetAppointmentList().then(function(response) {
                appts = response.getBody();
                checkOnlineUser();
            }).catch(function(err) {
                appts = [];
                checkOnlineUser();
            })
        } else checkOnlineUser();
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