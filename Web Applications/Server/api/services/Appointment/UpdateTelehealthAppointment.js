module.exports = function(data) {
    var $q = require('q');
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            var dataAppt = Services.GetDataAppointment.Appointment(data);
            //update Appointment
            Appointment.update(dataAppt, {
                    where: {
                        UID: data.UID
                    }
                }, {
                    transaction: t
                })
                .then(function(apptUpdated) {
                    if (HelperService.CheckExistData(data.TelehealthAppointment)) {
                        var dataTeleAppt = Services.GetDataAppointment.TelehealthAppointment(data.TelehealthAppointment);
                        //update TelehealthAppointment
                        TelehealthAppointment.update(dataTeleAppt, {
                                where: {
                                    ID: data.TelehealthAppointment.ID
                                }
                            }, {
                                transaction: t
                            })
                            .then(function(teleApptUpdated) {
                                if (HelperService.CheckExistData(data.Patients) &&
                                    HelperService.CheckExistData(data.Patients[0])) {
                                    //update patient appointment
                                    var dataPatient = Services.GetDataAppointment.Patient(data.Patients[0]);
                                    PatientAppointment.update(dataPatient, {
                                            where: {
                                                UID: data.Patients.UID
                                            }
                                        }, {
                                            transaction: t
                                        })
                                        .then(function(patientApptUpdated) {
                                            if (HelperService.CheckExistData(data.Doctors) &&
                                                HelperService.CheckExistData(data.Doctors[0])) {
                                                //upadte doctor telehealth appointment
                                                var dataDoctor = Services.GetDataAppointment.Doctor(data.Doctors[0]);
                                                Doctor.update(dataDoctor, {
                                                        where: {
                                                            UID: data.Doctors[0].UID
                                                        }
                                                    }, {
                                                        transaction: t
                                                    })
                                                    .then(function(doctorUpdated) {

                                                    })
                                                    .catch(function() {

                                                    });
                                            } else {
                                                /*
                                                only update appointment, telehealt appointment, patient - complete
                                                */
                                                defer.resolve({
                                                    transaction: t,
                                                    status: 'success'
                                                });
                                            }
                                        })
                                        .catch(function(err) {
                                            defer.reject({
                                                transaction: t,
                                                error: err
                                            });
                                        });
                                } else {
                                    /*
                                    only update appointment, telehealt appointment - complete
                                    */
                                    defer.resolve({
                                        transaction: t,
                                        status: 'success'
                                    });
                                }
                            })
                            .catch(function(err) {
                                defer.reject({
                                    transaction: t,
                                    error: err
                                });
                            });
                    } else {
                        /*
                        only update appointment - complete
                        */
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }
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
