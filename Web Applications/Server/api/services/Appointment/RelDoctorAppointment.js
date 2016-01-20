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
                var error = new Error('relDoctorAppointment.objDoctor.not.exist');
                defer.reject(error);
            }
        }, function(err) {
            defer.reject(err);
        })
        .then(function(relDoctorAppointmentCreated) {
            defer.resolve(relDoctorAppointmentCreated);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
