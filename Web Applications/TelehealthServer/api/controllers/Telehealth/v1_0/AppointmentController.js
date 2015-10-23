module.exports = {
    UpdateFile: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Appointment.UpdateFile.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var info = HelperService.toJson(req.body.data);
        if (!info.fileuid || !info.apptid) {
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
            RelAppointmentFileUpload.create({
                FileUploadID: file.ID,
                AppointmentID: info.apptid
            }).then(function() {
                res.ok({
                    status: 'success'
                });
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        })
    }
}