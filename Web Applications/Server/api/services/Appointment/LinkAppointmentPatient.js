module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var appointmentObject = null;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Appointment) &&
        !_.isEmpty(data.Patient)) {
        sequelize.transaction()
            .then(function(t) {
                Appointment.findOne({
                        attributes: ['ID'],
                        where: data.Appointment,
                        transaction: t
                    })
                    .then(function(apptObj) {
                        if (!_.isEmpty(apptObj)) {
                            appointmentObject = apptObj;
                            return Patient.findOne({
                                attributes: ['ID'],
                                where: data.Patient,
                                raw: true,
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                error: new Error('Appointment.not.found'),
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({ error: err, transaction: t });
                    })
                    .then(function(patientObj) {
                        if (!_.isEmpty(patientObj) &&
                            !_.isEmpty(appointmentObject)) {
                            return appointmentObject.setPatients(patientObj.ID, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                error: new Error('Patient.not.found'),
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({ error: err, transaction: t });
                    })
                    .then(function(patientObj) {
                        defer.resolve({ status: 'success', transaction: t });
                    }, function(err) {
                        defer.reject({ error: err, transaction: t });
                    });
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        defer.reject({ error: new Error('data.isEmpty') });
    }
    return defer.promise;
};
