var http = require('http');
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
            if (response.getHeaders().newtoken) res.set("newtoken", response.getHeaders().newtoken);
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
                    return res.ok(TelehealthService.CheckOnlineUser(appts));
                }).catch(function(err) {
                    res.serverError(ErrorWrap(err));
                })
            } else return res.ok(TelehealthService.CheckOnlineUser(appts));
        }, function(err) {
            res.serverError(err.getBody());
        });
    },
    ListTelehealth: function(req, res) {
        var appts = [];
        var headers = req.headers;
        TelehealthService.GetAppointmentListTelehealth(headers,req).then(function(response) {
            var data = response.getBody();
            if(response.getCode() == 202){
                res.set("newtoken", response.getHeaders().newtoken);
                req.session.passport.user.SecretKey = response.getHeaders().newsecret;
                req.session.passport.user.SecretCreatedDate = response.getHeaders().newsecretcreateddate;
                req.session.passport.user.TokenExpired = response.getHeaders().tokenexpired;
            }
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
                    return res.ok(TelehealthService.CheckOnlineUser(appts));
                }).catch(function(err) {
                    res.serverError(ErrorWrap(err));
                })
            } else return res.ok(TelehealthService.CheckOnlineUser(appts));
        }, function(err) {
            res.serverError(err.getBody());
        });
        // var bodyData = '';
        // if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        // var options = {
        //     hostname:'192.168.1.130',
        //     port:'3005',
        //     path:'/api/appointment-telehealth-list',
        //     method:'POST',
        //     headers: headers
        // };
        // var body = {
        //     data: {
        //         Order: [{
        //             Appointment: {
        //                 FromTime: 'DESC'
        //             }
        //         }],
        //         Filter: [{
        //             Appointment: {
        //                 Status:'Approved',
        //                 FromTime: sails.moment().format('YYYY-MM-DD ZZ'),
        //                 Enable: "Y"
        //             }
        //         }]
        //     }
        // };
        // var httpRequest = http.request(options,function(response){
        //     response.setEncoding('utf8');
        //     console.log("====Headers====: ",response.headers);
        //     if (response.headers.newtoken) res.set("newtoken", response.headers.newtoken);
        //     response.on('data',function(chunk){
        //         bodyData += chunk;
        //     })
        //     response.on('end',function(){
        //         res.ok(JSON.parse(bodyData));
        //     })
        // })
        // httpRequest.on('error',function(err){
        //     res.serverError(ErrorWrap(err));
        // })
        // httpRequest.write(JSON.stringify(body));
        // httpRequest.end();
    }
}