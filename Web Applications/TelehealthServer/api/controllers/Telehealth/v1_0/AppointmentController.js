module.exports = {
    UpdateFile: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Appointment.UpdateFile.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var info = HelperService.toJson(req.body.data);
        if (!info.fileuid || !info.apptuid) {
            var err = new Error("Appointment.UpdateFile.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        FileUpload.find({
            where: {
                UID: info.fileuid
            }
        }).then(function(file) {
            if (!file) {
                var err = new Error("Appointment.UpdateFile.Error");
                err.pushError("File Not Exists");
                return res.serverError(ErrorWrap(err));
            }
            Appointment.find({
                where: {
                    UID: info.apptuid
                }
            }).then(function(appt) {
                if (appt) {
                    RelAppointmentFileUpload.create({
                        FileUploadID: file.ID,
                        AppointmentID: appt.ID
                    }).then(function() {
                        res.ok({
                            status: 'success'
                        });
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                } else {
                    var err = new Error("Appointment.UpdateFile.Error");
                    err.pushError("Appointment Not Exists");
                    return res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        })
    },
    ListWA: function(req, res) {
        var appts = [];
        var headers = req.headers;
        TelehealthService.GetAppointmentListWA(headers).then(function(response) {
            var data = response.getBody();
            if (data.count > 0) {
                appts = data.rows;
                TelehealthUser.findAll().then(function(teleUsers) {
                    for (var i = 0; i < teleUsers.length; i++) {
                        for (var j = 0; j < appts.length; j++) {
                            if (appts[j].Patients.length > 0 && appts[j].Patients[0].UserAccount) {
                                if (teleUsers[i].userAccountID == appts[j].Patients[0].UserAccount.ID) {
                                    appts[j].IsOnline = 0;
                                    appts[j].TeleUID = teleUsers[i].UID;
                                }
                            }
                        }
                    }
                    res.ok(TelehealthService.CheckOnlineUser(appts));
                }).catch(function(err) {
                    res.serverError(ErrorWrap(err));
                })
            } else res.ok(TelehealthService.CheckOnlineUser(appts));
        }).catch(function(err) {
            res.serverError(err.getBody());
        })
    },
    ListTelehealth: function(req,res){
        var appts = [];
        var headers = req.headers;
        TelehealthService.GetAppointmentListTelehealth(headers).then(function(response) {
            var data = response.getBody();
            if (data.count > 0) {
                appts = data.rows;
                TelehealthUser.findAll().then(function(teleUsers) {
                    for (var i = 0; i < teleUsers.length; i++) {
                        for (var j = 0; j < appts.length; j++) {
                            if (appts[j].Patients.length > 0 && appts[j].Patients[0].UserAccount) {
                                if (teleUsers[i].userAccountID == appts[j].Patients[0].UserAccount.ID) {
                                    appts[j].IsOnline = 0;
                                    appts[j].TeleUID = teleUsers[i].UID;
                                }
                            }
                        }
                    }
                    res.ok(TelehealthService.CheckOnlineUser(appts));
                }).catch(function(err) {
                    res.serverError(ErrorWrap(err));
                })
            } else res.ok(TelehealthService.CheckOnlineUser(appts));
        }).catch(function(err) {
            res.serverError(err.getBody());
        })
    }
}