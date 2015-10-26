module.exports = {
    /*
    RequestTelehealthAppointment - Controller: request new Appointment for Telehealth Appointment
    input: infomation new Telehealth Appointment, infomation created
    output: -success: transaction created new Telehealth Appointment
            -error: [transaction] created new Telehealth Appointment, error message
    */
    RequestTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.CreateTelehealthAppointment(data, req.user)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error));
                });
        }
    },
    /*
    GetListTelehealthAppointment - Controller: get list Telehealth Appointment with condition received
    input: information filter list Telehealth Appointment, information user filter
    output: -success: list Telehealth Appointment
            -error: [transaction] load list Telehealth Appointment, error message.
    */
    GetListTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListTelehealthAppointment(data, req.user)
                .then(function(success) {
                    res.ok(success.data);
                })
                .catch(function(err) {
                    if (HelperService.CheckPostRequest(err) &&
                        HelperService.CheckPostRequest(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    /*
    GetDetailTelehealthAppointment - Controller: get information detail Telehealth Appointment
    input: UID Telehealth Appointment
    output: -success: information details Telehealth Appointment
            -error: [transaction] information details Telehealth Appointment, error message
    */
    GetDetailTelehealthAppointment: function(req, res) {
        var UID = req.params.UID;
        Services.GetDetailTelehealthAppointment(UID)
            .then(function(success) {
                res.ok(success);
            })
            .catch(function(err) {
                if (HelperService.CheckPostRequest(err) &&
                    HelperService.CheckPostRequest(err.transaction)) {
                    err.transaction.rollback();
                }
                res.serverError(ErrorWrap(err));
            });
    },
    /*
    UpdateTelehealthAppointment - Controller: Update information Telehealth Appointment
    input: new information telehealth appointment
    output: - success: transaction updated Telehealth Appointment
            - failed: [transaction] updated Telehealth Appointment, error message
    */
    UpdateTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isInternalPractitioner ||
                role.isAdmin ||
                role.isAssistant) {
                Services.UpdateTelehealthAppointment(data, req.user)
                    .then(function(success) {
                        success.transaction.commit();
                        res.ok('success');
                    })
                    .catch(function(err) {
                        if (HelperService.CheckPostRequest(err) &&
                            HelperService.CheckPostRequest(err.transaction)) {
                            err.transaction.rollback();
                        }
                        res.serverError(ErrorWrap(err.error));
                    });
            } else {
                res.serverError('failed');
            }

        }
    },
    /*
    DeleteTelehealthAppointment - Controller: Delete  a Telehealth Appointment
    input: UID Appointment
    output: - success: transaction updated Enable is 'N' Telehealth Appointment
            - error: [transaction] updated Enable is 'N' Telehealth Appointment, error message
    */
    DeleteTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.DeleteTelehealthAppointment(data)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    if (HelperService.CheckPostRequest(err) &&
                        HelperService.CheckPostRequest(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    /*
    RequestWAAppointment - Controller: request new Appointment for WA Appointment
    input: infomation new WA Appointment, infomation created
    output: -success: transaction created new WA Appointment
            -error: [transaction] created new WA Appointment, error message
    */
    RequestWAAppointment: function(req, res) {},
    /*
    GetListWAAppointment - Controller: get list WA Appointment with condition received
    input: information filter list WA Appointment, information user filter
    output: -success: list WA Appointment
            -error: [transaction] load list WA Appointment, error message.
    */
    GetListWAAppointment: function(req, res) {},
    /*
       GetDetailWAAppointment - Controller: get information detail WA Appointment
       input: UID WA Appointment
       output: -success: information details WA Appointment
               -error: [transaction] information details WA Appointment, error message
       */
    GetDetailWAAppointment: function(req, res) {},
    /*
    UpdateWAAppointment - Controller: Update information WA Appointment
    input: new information WA Appointment
    output: - success: transaction updated WA Appointment
            - failed: [transaction] updated WA Appointment, error message
    */
    UpdateWAAppointment: function(req, res) {},
    /*
    DeleteWAAppointment - Controller: Delete  a WA Appointment
    input: UID Appointment
    output: - success: transaction updated Enable is 'N' WA Appointment
            - error: [transaction] updated Enable is 'N' WA Appointment, error message
    */
    DeleteWAAppointment: function(req, res) {}
};
