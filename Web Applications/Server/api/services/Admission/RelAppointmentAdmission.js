var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data)) {
        if (HelperService.CheckExistData(objRel.appointmentObject)) {
            return objRel.appointmentObject.addAdmission(objRel.data, {
                transaction: objRel.transaction
            });
        } else {
            return RelAppointmentAdmission.create(objRel.data, {
                transaction: objRel.transaction
            });
        }
    } else {
        defer.reject('objRel.RelAppointmentAdmission.data.failed');
    }
    return defer.promise;
};
