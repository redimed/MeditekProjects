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
            defer.reject(err);
        })
        .then(function(preferredPractitionerUpdated) {
            defer.resolve(preferredPractitionerUpdated);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
