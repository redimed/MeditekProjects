module.exports = {
    /*
    RequestWAAppointment - Controller: request new Appointment for WA Appointment
    input: infomation new WA Appointment, infomation created
    output: -success: transaction created new WA Appointment
            -error: [transaction] created new WA Appointment, error message
    */
    RequestWAAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestWAAppointment(data, req.user)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                }, function(err) {
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
    GetListWAAppointment - Controller: get list WA Appointment with condition received
    input: information filter list WA Appointment, information user filter
    output: -success: list WA Appointment
            -error: [transaction] load list WA Appointment, error message.
    */
    GetListWAAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            //filter WAAppointment
            // if (!HelperService.CheckExistData(data.Filter)) {
            //     data.Filter = [];
            // }
            // data.Filter.push({
            //     "TelehealthAppointment": {
            //         "Type": "WAA"
            //     }
            // });
            Services.GetListAppointment(data, req.user)
                .then(function(success) {
                    res.ok(success.data);
                }, function(err) {
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
       GetDetailWAAppointment - Controller: get information detail WA Appointment
       input: UID WA Appointment
       output: -success: information details WA Appointment
               -error: [transaction] information details WA Appointment, error message
       */
    GetDetailWAAppointment: function(req, res) {
        var UID = req.params.UID;
        Services.GetDetailWAAppointment(UID, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
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
    UpdateRequestWAAppointment - Controller: Update information WA Appointment
    input: new information WA Appointment
    output: - success: transaction updated WA Appointment
            - failed: [transaction] updated WA Appointment, error message
    */
    UpdateRequestWAAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isInternalPractitioner ||
                role.isAdmin ||
                role.isAssistant) {
                Services.UpdateRequestWAAppointment(data, req.user)
                    .then(function(success) {
                        success.transaction.commit();
                        res.ok('success');
                    }, function(err) {
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
                res.serverError('user.not(interalPractitioner,admin,assistant)');
            }

        }
    },
    /*
    DisableWAAppointment - Controller: Delete  a WA Appointment
    input: UID Appointment
    output: - success: transaction updated Enable is 'N' WA Appointment
            - error: [transaction] updated Enable is 'N' WA Appointment, error message
    */
    DisableWAAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.DisableAppointment(data)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                }, function(err) {
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
