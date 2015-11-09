var $q = require('q');
module.exports = function(objUpdate) {
    var defer = $q.defer();
    PreferredPractitioner.destroy({
            where: {
                TelehealthAppointmentID: objUpdate.where
            },
            transaction: objUpdate.transaction
        })
        .then(function(preferredPractitionerDeleted) {
            return Services.BulkCreatePreferredPractitioner(objUpdate);
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        })
        .then(function(preferredPractitionerUpdated) {
            defer.resolve(preferredPractitionerUpdated);
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        });
    return defer.promise;
};
