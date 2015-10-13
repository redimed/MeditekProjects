module.exports = function(data) {
    var $q = require('q');
    var telehealthApointmentCreated;
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            if (HelperService.CheckExistData(data.UserInfo) &&
                HelperService.CheckExistData(data.UserInfo.UID)) {
                //create new appointment
                UserAccount.findOne({
                        attributes: ['ID'],
                        include: [{
                            attributes: ['ID'],
                            model: Doctor,
                            required: true
                        }],
                        where: {
                            UID: data.UserInfo.UID
                        },
                        transaction: t
                    })
                    .then(function(preferringPractitioner) {
                        if (HelperService.CheckExistData(preferringPractitioner)) {
                            var dataAppointment = Services.GetDataAppointment.Appointment(data);
                            dataAppointment.UID = UUIDService.Create();
                            //create Appointment
                            return Appointment.create(dataAppointment, {
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(appointmentCreated) {
                        /*create new TelehealthAppointment link with 
                        appointment created via AppointmentID */
                        if (HelperService.CheckExistData(data.TelehealthAppointment)) {
                            var dataTelehealthAppointment =
                                Services.GetDataAppointment.TelehealthAppointment(data.TelehealthAppointment);
                            dataTelehealthAppointment.UID = UUIDService.Create();
                            return appointmentCreated.createTelehealthAppointment(dataTelehealthAppointment, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(telehealthApptCreated) {
                        telehealthApointmentCreated = telehealthApptCreated;
                        /*create new PatientAppointment link with TelehealthAppointment 
                        created via TelehealthAppointmentID*/
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PatientAppointment)) {
                            var dataPatientAppointment =
                                Services.GetDataAppointment.PatientAppointment(data.TelehealthAppointment.PatientAppointment);
                            dataPatientAppointment.UID = UUIDService.Create();
                            return telehealthApointmentCreated.createPatientAppointment(dataPatientAppointment, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(patientAppointmentCreated) {
                        /*create new ExaminationRequired link with TelehealthAppointment
                        created via TelehealthAppointmentID*/
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ExaminationRequired)) {
                            var dataExamniationRequired =
                                Services.GetDataAppointment.ExaminationRequired(data.TelehealthAppointment.ExaminationRequired);
                            dataExamniationRequired.UID = UUIDService.Create();
                            return telehealthApointmentCreated.createExaminationRequired(dataExamniationRequired, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(examinationRequiredCreated) {
                        /*create new PreferedPlasticSurgeon
                        link with TelehealthAppointment via TelehealthAppointmentID*/
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PreferedPlasticSurgeon)) {
                            var dataPrefPlasSurgon = Services.GetDataAppointment.PreferedPlasticSurgeon(data.TelehealthAppointment.PreferedPlasticSurgeon);
                            dataPrefPlasSurgon.UID = UUIDService.Create();
                            return telehealthApointmentCreated.createPreferedPlasticSurgeon(dataPrefPlasSurgon, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(preferedPlasticSurgeonCreated) {
                        /*create new list TelehealthClinicalDetails
                        link with TelehealthAppointment via TelehealthAppointmentID*/
                        var teleApptID = (!_.isUndefined(telehealthApointmentCreated.dataValues) ? telehealthApointmentCreated.dataValues.ID : null);
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ClinicalDetails)) {
                            var dataTeleClinicDetail =
                                Services.GetDataAppointment.ClinicalDetails(teleApptID, data.TelehealthAppointment.ClinicalDetails);
                            return ClinicalDetail.bulkCreate(dataTeleClinicDetail, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(clinicalDetailsCreated) {
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    });
            } else {
                defer.reject({
                    transaction: t,
                    error: err
                });
            }
            return defer.promise;
        });
};
