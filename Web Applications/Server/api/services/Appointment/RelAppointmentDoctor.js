module.exports = function(objRel) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('RelAppointmentDoctor');
    if (!_.isEmpty(objRel) &&
        !_.isEmpty(objRel.where) &&
        !_.isEmpty(objRel.appointmentObject)) {
        Doctor.findAll({
                attributes: ['ID'],
                where: {
                    $or: objRel.where
                },
                transaction: objRel.transaction,
                raw: true
            })
            .then(function(doctorIDs) {
                if (!_.isEmpty(doctorIDs)) {
                    doctorIDs = _.map(_.uniq(doctorIDs, 'ID'), 'ID');
                    return objRel.appointmentObject.setDoctors(doctorIDs, {
                        transaction: objRel.transaction
                    });
                }
            }, function(err) {
                error.pushError(error);
                defer.reject(error);
            })
            .then(function(relapptDoctorCreated) {
                defer.resolve(relapptDoctorCreated);
            }, function(err) {
                error.pushError(error);
                defer.reject(error);
            });
    } else {
        error.pushError('data.isEmpty');
        defer.reject(error);
    }
    return defer.promise;
};
