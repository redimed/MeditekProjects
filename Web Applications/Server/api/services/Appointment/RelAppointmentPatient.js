module.exports = function(objRel) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('RelAppointmentPatient');
    if (!_.isEmpty(objRel) &&
        !_.isEmpty(objRel.where)) {
        Patient.findAll({
                attributes: ['ID'],
                where: {
                    $or: objRel.where
                },
                transaction: objRel.transaction,
                raw: true
            })
            .then(function(patientIDs) {
                if (!_.isEmpty(patientIDs)) {
                    patientIDs = _.map(_.uniq(patientIDs, 'ID'), 'ID');
                    return objRel.appointmentObject.setPatients(patientIDs, {
                        transaction: objRel.transaction
                    });
                }
            }, function(err) {
                error.pushError(err);
                defer.reject(error);
            })
            .then(function(relapptPatientCreated) {
                defer.resolve(relapptPatientCreated);
            }, function(err) {
                error.pushError(err);
                defer.reject(error);
            });
    } else {
        error.pushError('data.isEmpty');
        defer.reject(error);
    }
    return defer.promise;
};
