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
                defer.reject({
                    transaction: objRel.transaction,
                    error: err
                });
            }
        }, function(err) {
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        })
        .then(function(relPatientAppointmentCreated) {
            defer.resolve(relPatientAppointmentCreated);
        }, function(err) {
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        });
    return defer.promise;
};
