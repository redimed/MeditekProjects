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
            Services.RequestTelehealthAppointment(data, req.user)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
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
            //filter Telehealth Appointment
            // if (!HelperService.CheckExistData(data.Filter)) {
            //     data.Filter = [];
            // }
            // data.Filter.push({
            //     "TelehealthAppointment": {
            //         "Type": "TEL"
            //     }
            // });
            Services.GetListAppointment(data, req.user)
                .then(function(success) {
                    res.ok(success.data);
                })
                .catch(function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
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
        Services.GetDetailTelehealthAppointment(UID, req.user)
            .then(function(success) {
                res.ok(success);
            })
            .catch(function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction) &&
                    HelperService.CheckExistData(err.error)) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err.error));
                } else {
                    res.serverError(ErrorWrap(err));
                }
            });
    },
    /*
    UpdateRequestTelehealthAppointment - Controller: Update information Telehealth Appointment
    input: new information telehealth appointment
    output: - success: transaction updated Telehealth Appointment
            - failed: [transaction] updated Telehealth Appointment, error message
    */
    UpdateRequestTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isAdmin ||
                role.isAssistant) {
                Services.UpdateRequestTelehealthAppointment(data, req.user)
                    .then(function(success) {
                        success.transaction.commit();
                        res.ok('success');
                    })
                    .catch(function(err) {
                        if (HelperService.CheckExistData(err) &&
                            HelperService.CheckExistData(err.transaction) &&
                            HelperService.CheckExistData(err.error)) {
                            err.transaction.rollback();
                            res.serverError(ErrorWrap(err.error));
                        } else {
                            res.serverError(ErrorWrap(err));
                        }
                    });
            } else {
                res.serverError('failed');
            }

        }
    },
    /*
    DisableTelehealthAppointment - Controller: Delete  a Telehealth Appointment
    input: UID Appointment
    output: - success: transaction updated Enable is 'N' Telehealth Appointment
            - error: [transaction] updated Enable is 'N' Telehealth Appointment, error message
    */
    DisableTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.DisableAppointment(data)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    }
};
