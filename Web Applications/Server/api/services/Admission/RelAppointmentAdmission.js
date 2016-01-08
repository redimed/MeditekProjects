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
        var error = new Error('objRel.RelAppointmentAdmission.data.failed');
        defer.reject(error);
    }
    return defer.promise;
};
