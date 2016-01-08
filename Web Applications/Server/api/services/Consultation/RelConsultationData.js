var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data)) {
        if (HelperService.CheckExistData(objRel.consultationObject)) {
            return objRel.consultationObject.addConsultationData(objRel.data, {
                transaction: objRel.transaction
            });
        } else {
            return RelConsultationData.create(objRel.data, {
                transaction: objRel.transaction
            });
        }
    } else {
        var error = new Error('objRel.RelConsultationData.failed');
        defer.reject(error);
    }
    return defer.promise;
};
