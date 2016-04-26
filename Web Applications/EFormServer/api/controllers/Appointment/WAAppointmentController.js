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
        var result = {};
        Services.GetDetailWAAppointment(UID)
        .then(function(success) {
            result = success;
            result.dataValues.Patient = result.dataValues.Patients[0] || null;
            result.dataValues.UserAccount = result.dataValues.Patients[0]
                                            && result.dataValues.Patients[0].UserAccount?
                                            result.dataValues.Patients[0].UserAccount:null;
            result.dataValues.Doctor = result.dataValues.Doctors[0] || null;
            delete result.dataValues.Patients;
            delete result.dataValues.Doctors;
            if(result.dataValues.ID && result.dataValues.Patient && result.dataValues.Patient.ID)
            {
                return Services.GetCompanyInfo(result.dataValues.Patient.ID, result.dataValues.ID);
            } else {
                return null;
            }

        })
        .then(function(data){
            if(data) {
                result.dataValues.Company = data.company;
                result.dataValues.CompanySite = data.companySite;
            }
            res.ok({data:result});
        }, function(err) {
            if (HelperService.CheckExistData(err) &&
                HelperService.CheckExistData(err.transaction) &&
                HelperService.CheckExistData(err.error)) {
                err.transaction.rollback();
                res.serverError(ErrorWrap(err.error));
            } else {
                res.serverError(ErrorWrap(err));
            }
        })
        /*var UID = req.params.UID;
        Appointment.findOne({
            where: {UID: UID},
            include: [
                {
                    model: Patient,
                    required: false,
                    include: [
                        {model: UserAccount, required: false}
                    ]
                },
                {
                    model: TelehealthAppointment,
                    required: false
                }
            ]
        })
        .then(function(response){
            response.dataValues.Patient = response.dataValues.Patients[0];
            response.dataValues.UserAccount = response.dataValues.Patients[0].UserAccount;

            res.ok({data: response});
        }, function(error){
            res.serverError(ErrorWrap(err));
        })*/
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
    },
    RequestWAAppointmentPatient: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestWAAppointmentPatient(data, req.user)
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
