module.exports = function(data) {
    var $q = require('q');
    var telehealthApointmentCreated;
    var dataAppointment = Services.GetDataAppointment.Appointment(data);
    dataAppointment.UID = UUIDService.Create();
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            //create new appointment
            Appointment.create(dataAppointment, {
                    transaction: t
                })
                .then(function(apptCreated) {
                    /*create new TelehealthAppointment link with 
                    appointment created via AppointmentID */
                    if (HelperService.CheckExistData(data.TelehealthAppointment)) {
                        var dataTelehealthAppointment =
                            Services.GetDataAppointment.TelehealthAppointment(data.TelehealthAppointment);
                        dataTelehealthAppointment.UID = UUIDService.Create();
                        return apptCreated.createTelehealthAppointment(dataTelehealthAppointment, {
                            transaction: t
                        });
                    } else {
                        defer.reject({
                            transaction: t,
                            error: 'failed'
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
                            error: 'failed'
                        });
                    }
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(patientApptCreated) {
                    /*create new ExaminationRequired link with TelehealthAppointment
                    created via TelehealthAppointmentID*/
                    if (HelperService.CheckExistData(data.TelehealthAppointment.ExaminationRequired)) {
                        var dataExamniationRequired =
                            Services.GetDataAppointment.ExaminationRequired(data.TelehealthAppointment.ExaminationRequired);
                        return telehealthApointmentCreated.createExaminationRequired(dataExamniationRequired, {
                            transaction: t
                        });
                    } else {
                        defer.reject({
                            transaction: t,
                            error: 'failed'
                        });
                    }
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(examinationRequiredCreated) {
                    /*create new list TelehealthClinicalDetails
                    link with TelehealthAppointment via TelehealthAppointmentID*/
                    if (HelperService.CheckExistData(data.TelehealthAppointment.PreferedPlasticSurgeon)) {
                        var dataPrefPlasSurgon =
                            Services.GetDataAppointment.PrefPlasSurgon(data.TelehealthAppointment.PreferedPlasticSurgeon);
                        telehealthApointmentCreated.createPreferedPlasticSurgeon(dataPrefPlasSurgon, {
                            transaction: t
                        });
                    } else {
                        defer.reject({
                            transaction: t,
                            error: 'failed'
                        });
                    }
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(prefPlasSurgonCreated) {
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
                            error: 'failed'
                        });
                    }
                })
                .then(function(clinicalDetailCreated) {
                    defer.resolve({
                        transaction: t,
                        status: 'success'
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
            return defer.promise;
        });
};
