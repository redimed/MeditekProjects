var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data)) {
        if (HelperService.CheckExistData(objRel.appointmentObject)) {
            return objRel.appointmentObject.addConsultations(objRel.data, {
                transaction: objRel.transaction
            });
        } else {
            return RelAppointmentConsultation.create(objRel.data, {
                transaction: objRel.transaction
            });
        }
    } else {
        var error = new Error('objRel.RelAppointmentConsultation.data.failed');
        defer.reject(error);
    }
    return defer.promise;
};
