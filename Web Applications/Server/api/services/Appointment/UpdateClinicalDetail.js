var $q = require('q');
module.exports = function(objUpdate) {
    var defer = $q.defer();
    ClinicalDetail.destroy({
            where: {
                TelehealthAppointmentID: objUpdate.where
            },
            transaction: objUpdate.transaction
        })
        .then(function(clinicalDetailDeleted) {
            return Services.BulkCreateClinicalDetail(objUpdate);
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        })
        .then(function(clinicalDetailUpdated) {
            defer.resolve(clinicalDetailUpdated);
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        });
    return defer.promise;
};
