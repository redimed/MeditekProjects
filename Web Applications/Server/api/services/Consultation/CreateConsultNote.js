var $q = require('q');
module.exports = function(objCreate) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objCreate) &&
        HelperService.CheckExistData(objCreate.data)) {
        return Consultation.create(objCreate.data, {
            transaction: objCreate.transaction
        });
    } else {
        defer.reject('objCreate.data.ConsultNote.failed');
    }
    return defer.promise;
};
