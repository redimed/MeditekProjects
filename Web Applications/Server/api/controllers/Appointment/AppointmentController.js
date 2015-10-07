module.exports = {
    /*
    RequestAppointment: save information patient, 
    create new appointment, create telehealth appointment,
    link telehealth appointment with appointment created, 
    send email and notification for admin system
    input: information patient
    outout: -success: request apppointment success
            -failed: request appointment error
    */
    RequestAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.CreateTelehealthAppointment(data)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    /*
    GetListTelehealthAppointment: get list appointment with condition receive
    inpput: information pagination, search, .....
    output: list appointment via condition
    */
    GetListTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListTelehealthAppointment(data)
                .then(function(success) {
                    res.ok(success.data);
                })
                .catch(function(err) {
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    /*
    GetDetailTelehealthAppointment: get information detail telehealth appointment
    input: UID appointment
    output: detail information telehealth appointment
    */
    GetDetailTelehealthAppointment: function(req, res) {
        var UID = req.params.UID;
        Services.GetDetailTelehealthAppointment(UID)
            .then(function(success) {
                res.ok(success);
            })
            .catch(function(err) {
                res.serverError(ErrorWrap(err));
            });
    },
    /*
    UpdateTelehealthAppointment: Update information telehealth appointment
    input: new information telehealth appointment
    output: - success: update telehealth appointment success
            - error: updated telehealth appointment failed
    */
    UpdateTelehealthAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.UpdateTelehealthAppointment(data)
                .then(function(success) {
                    success.transaction.commit();
                    res.ok('success');
                })
                .catch(function(err) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err.error));
                });
        }
    },
    /*
    UpdateAppointment : update status in appointment
    input : Appointment ID, Status ,ModifiedBy
    output : success - data :'success' and status :200
             failed: - Erorr :err and status :500
    */
    UpdateAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.badRequest('failed');
        } else {
            var dataUpdate = req.body.data
            return sequelize.transaction()
                .then(function(t) {
                    Appointment.findOne({
                            where: {
                                ID: dataUpdate.ID
                            }
                        }, {
                            transaction: t
                        })
                        .then(function(appointment) {
                            appointment.updateAttributes({

                                    Status: dataUpdate.Status,
                                    ModifiedBy: dataUpdate.ModifiedBy

                                }).then(function(dataUpdate) {
                                    res.json(200, {
                                        data: 'success',
                                        status: 200
                                    });
                                })
                                .catch(function(err) {
                                    res.json(500, {
                                        error: err,
                                        status: 500
                                    });
                                });
                        })
                        .catch(function(err) {
                            res.json(500, {
                                error: err,
                                status: 500
                            });
                        });
                });
        }
    },
    /*
    DeleteAppointment : update Enable = 0 
    input : Appointment ID
    output : success - data :'success' and status :200
             failed: - Erorr :err and status :500
    */
    DeleteAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.badRequest('failed');
        } else {
            var dataDelete = req.body.data
            return sequelize.transaction()
                .then(function(t) {
                    Appointment.findOne({
                            where: {
                                ID: dataDelete.ID
                            }
                        }, {
                            transaction: t
                        })
                        .then(function(appointment) {
                            appointment.updateAttributes({
                                    Enable: 0
                                })
                                .then(function(dataDelete) {
                                    res.json(200, {
                                        data: 'success',
                                        status: 200
                                    });
                                })
                                .catch(function(err) {
                                    res.json(500, {
                                        error: err,
                                        status: 500
                                    });
                                });
                        })
                        .catch(function(err) {
                            res.json(500, {
                                error: err,
                                status: 500
                            });
                        });
                });
        }
    },
    /*
    DetailOneAppointment : get detail a specific Appointment
    input : Appointment ID
    output : success - status :'success' and data : information appointment
             failed: - Erorr :err and status :500
    */
    DetailOneAppointment: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.badRequest('failed');
        } else {
            var dataRequest = req.body.data
            return sequelize.transaction()
                .then(function(t) {
                    Appointment.findOne({
                            where: {
                                ID: dataRequest.ID
                            },
                            attributes: AppointmentServices.AppointmentAttributes,
                            include: [{
                                model: TelehealthAppointment,
                                attributes: AppointmentServices.TeleheathAppointmentAttributes,
                                include: [{
                                    model: PatientAppointment,
                                    attributes: AppointmentServices.PatientAppointmentAttibutes,
                                }, {
                                    model: ExaminationRequired,
                                    attributes: AppointmentServices.ExaminationrequiredAttributes
                                }, {
                                    model: PreferedPlasticSurgeon,
                                    attributes: AppointmentServices.PreferedPlasticSurgeonAttributes
                                }, {
                                    model: TelehealthClinicalDetail,
                                    attributes: AppointmentServices.TelehealthClinicalDetailAttributes
                                }, {
                                    model: GeneralPractitioner,
                                    attributes: AppointmentServices.GeneralPractitionerAttributes,
                                    include: [{
                                        model: Doctor,
                                        attributes: AppointmentServices.DoctorAttributes
                                    }]
                                }]
                            }]
                        }, {
                            transaction: t
                        })
                        .then(function(appointment) {
                            res.json({
                                'status': 'success',
                                'data': appointment
                            });
                        })
                        .catch(function(err) {
                            res.json(500, {
                                error: err,
                                status: 500
                            });
                        });
                });
        }
    }
};
