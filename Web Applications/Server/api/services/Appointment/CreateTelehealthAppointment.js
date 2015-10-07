module.exports = function(data) {
    var $q = require('q');
    var dataAppt = Services.GetDataAppointment.Appointment(data);
    dataAppt.UID = UUIDService.Create();
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            //create new appointment
            Appointment.create(dataAppt, {
                    transaction: t
                })
                .then(function(apptCreated) {
                    /*create new TelehealthAppointment link with 
                    appointment created via AppointmentID */
                    var dataTeleAppt = Services.GetDataAppointment.TelehealthAppointment(data);
                    apptCreated.createTelehealthAppointment(dataTeleAppt, {
                            transaction: t
                        })
                        .then(function(telehealthApptCreated) {
                            /*create new PatientAppointment link with TelehealthAppointment 
                            created via TelehealthAppointmentID*/
                            var dataPatientAppt = Services.GetDataAppointment.PatientAppointment(data);
                            dataPatientAppt.UID = UUIDService.Create();
                            telehealthApptCreated.createPatientAppointment(dataPatientAppt, {
                                    transaction: t
                                })
                                .then(function(patientAppt) {
                                    /*create new ExaminationRequired link with TelehealthAppointment
                                    created via TelehealthAppointmentID*/
                                    var dataExamniationRequired = Services.GetDataAppointment.ExamniationRequired(data);
                                    telehealthApptCreated.createExaminationRequired(dataExamniationRequired, {
                                            transaction: t
                                        })
                                        .then(function(examRequired) {
                                            /*create new ReferedPlasticSurgeon link with 
                                            TelehealthAppointment created via TelehealthAppointmentID*/
                                            var dataPrefPlasSurgon = Services.GetDataAppointment.PrefPlasSurgon(data);
                                            telehealthApptCreated.createPreferedPlasticSurgeon(dataPrefPlasSurgon, {
                                                    transaction: t
                                                })
                                                .then(function(refPlasSurgon) {
                                                    /*create new list TelehealthClinicalDetails
                                                    link with TelehealthAppointment via TelehealthAppointmentID*/
                                                    var teleApptID = (!_.isUndefined(telehealthAppt.dataValues) ? telehealthAppt.dataValues.ID : null);
                                                    var dataTeleClinicDetail = Services.GetDataAppointment.TeleApptDetail(teleApptID, data);
                                                    ClinicalDetail.bulkCreate(dataTeleClinicDetail, {
                                                            transaction: t
                                                        })
                                                        .then(function(teleCliniDetails) {
                                                            defer.resolve({
                                                                transaction: t,
                                                                status: 'success'
                                                            });
                                                        })
                                                        .catch(function(err) {
                                                            defer.reject({
                                                                transaction: t,
                                                                error: err
                                                            });
                                                        });
                                                })
                                                .catch(function(err) {
                                                    defer.reject({
                                                        transaction: t,
                                                        error: err
                                                    });
                                                });
                                        })
                                        .catch(function(err) {
                                            defer.reject({
                                                transaction: t,
                                                error: err
                                            });
                                        });
                                })
                                .catch(function(err) {
                                    defer.reject({
                                        transaction: t,
                                        error: err
                                    });
                                });
                        })
                        .catch(function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        });
                })
                .catch(function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                });
            return defer.promise;
        });
};
