module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objUpdate) &&
        !_.isEmpty(objUpdate.data) &&
        HelperService.CheckExistData(objUpdate.service)) {
        sequelize.Promise.each(objUpdate.data, function(valueRosterUpdate, indexRosterUpdate) {
                if (!_.isEmpty(valueRosterUpdate)) {
                    return valueRosterUpdate.setServices(objUpdate.service, {
                        transaction: objUpdate.transaction
                    });
                }
            })
            .then(function(relRosterServiceUpdated) {
                defer.resolve(relRosterServiceUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('UpdateRelRosterService.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
