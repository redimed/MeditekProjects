module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('LinkAppointmentPatient');
    var appointmentObject = null;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Appointment) &&
        !_.isEmpty(data.Patient)) {
        Appointment.findOne({
                attributes: ['ID'],
                where: data.Appointment
            })
            .then(function(apptObj) {
                if (!_.isEmpty(apptObj)) {
                    appointmentObject = apptObj;
                    return Patient.findOne({
                        attributes: ['ID'],
                        where: data.Patient,
                        raw: true
                    });
                }
            }, function(err) {
                error.pushError(err);
                defer.reject({ error: error });
            })
            .then(function(patientObj) {
                if (!_.isEmpty(patientObj) &&
                    !_.isEmpty(appointmentObject)) {
                    return appointmentObject.setPatients(patientObj.ID);
                }
            }, function(err) {
                error.pushError(err);
                defer.reject({ error: error });
            })
            .then(function(patientObj) {
                defer.resolve({ status: 'success' });
            }, function(err) {
                error.pushError(err);
                defer.reject({ error: error });
            })
    }
    return defer.promise;
};
