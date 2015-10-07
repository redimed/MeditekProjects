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
                            //update patient appointment
                            
                            PatientAppointment.update({

                                })
                                .then(function(patientApptUpdated) {

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
