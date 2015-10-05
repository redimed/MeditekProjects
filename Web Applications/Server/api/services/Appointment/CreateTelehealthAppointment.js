module.exports = function(data) {
    var $q = require('q');
    data.UIDAppt = UUIDService.Create();
    var dataAppt = Services.GetDataAppointment.Appointment(data);
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            //create new appointment
            Appointment.create(dataAppt, {
                    transaction: t
                })
                .then(function(appt) {
                    /*create new TelehealthAppointment link with 
                    appointment created via AppointmentID */
                    var dataTeleAppt = Services.GetDataAppointment.TelehealthAppointment(data);
                    appt.createTelehealthAppointment(dataTeleAppt, {
                            transaction: t
                        })
                        .then(function(telehealthAppt) {
                            /*create new PatientAppointment link with TelehealthAppointment 
                            created via TelehealthAppointmentID*/
                            data.UIDPatientAppt = UUIDService.Create();
                            var dataPatientAppt = Services.GetDataAppointment.PatientAppointment(data);
                            telehealthAppt.createPatientAppointment(dataPatientAppt, {
                                    transaction: t
                                })
                                .then(function(patientAppt) {
                                    /*create new ExaminationRequired link with TelehealthAppointment
                                    created via TelehealthAppointmentID*/
                                    var dataExamniationRequired = Services.GetDataAppointment.ExamniationRequired(data);
                                    telehealthAppt.createExaminationRequired(dataExamniationRequired, {
                                            transaction: t
                                        })
                                        .then(function(examRequired) {
                                            /*create new ReferedPlasticSurgeon link with 
                                            TelehealthAppointment created via TelehealthAppointmentID*/
                                            var dataPrefPlasSurgon = Services.GetDataAppointment.PrefPlasSurgon(data);
                                            telehealthAppt.createPreferedPlasticSurgeon(dataPrefPlasSurgon, {
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
                                                            t.commit();
                                                            defer.resolve({
                                                                result: 'success'
                                                            });
                                                        })
                                                        .catch(function(err) {
                                                            t.rollback();
                                                            defer.reject(err);
                                                        });
                                                })
                                                .catch(function(err) {
                                                    t.rollback();
                                                    defer.reject(err);
                                                });
                                        })
                                        .catch(function(err) {
                                            t.rollback();
                                            defer.reject(err);
                                        });
                                })
                                .catch(function(err) {
                                    t.rollback();
                                    defer.reject(err);
                                });
                        })
                        .catch(function(err) {
                            t.rollback();
                            defer.reject(err);
                        });
                })
                .catch(function(err) {
                    defer.reject(err);
                });
            return defer.promise;
        });
};
