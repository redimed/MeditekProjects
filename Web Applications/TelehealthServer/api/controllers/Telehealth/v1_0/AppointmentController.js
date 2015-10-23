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
    }
}