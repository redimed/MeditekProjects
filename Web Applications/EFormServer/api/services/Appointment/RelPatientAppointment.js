var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    Patient.findOne({
            attributes: ['ID'],
            where: {
                UID: objRel.where
            },
            transaction: objRel.transaction
        })
        .then(function(objPatient) {
            if (HelperService.CheckExistData(objPatient) &&
                HelperService.CheckExistData(objPatient.ID) &&
                HelperService.CheckExistData(objRel.appointmentObject)) {
                //link Appointment updated with objPatient received
                return objRel.appointmentObject.setPatients(objPatient.ID, {
                    transaction: objRel.transaction
                });
            } else {
                var error = new Error('relPatientAppointment.objPatient.not.exist');
                defer.reject(error);
            }
        }, function(err) {
            defer.reject(err);
        })
        .then(function(relPatientAppointmentCreated) {
            defer.resolve(relPatientAppointmentCreated);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
