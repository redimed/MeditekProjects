var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    Doctor.findOne({
            attributes: ['ID'],
            where: {
                UID: objRel.where
            },
            transaction: objRel.transaction
        })
        .then(function(objDoctor) {
            if (HelperService.CheckExistData(objDoctor) &&
                HelperService.CheckExistData(objDoctor.ID) &&
                HelperService.CheckExistData(objRel.appointmentObject)) {
                //link Appointment updated with objDoctor received
                return objRel.appointmentObject.setDoctors(objDoctor.ID, {
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
        .then(function(relDoctorAppointmentCreated) {
            defer.resolve(relDoctorAppointmentCreated);
        }, function(err) {
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        });
    return defer.promise;
};
