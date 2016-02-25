module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objUpdate) &&
        !_.isEmpty(objUpdate.data) &&
        HelperService.CheckExistData(objUpdate.site)) {
        sequelize.Promise.each(objUpdate.data, function(valueRosterUpdate, indexRosterUpdate) {
                if (!_.isEmpty(valueRosterUpdate)) {
                    return valueRosterUpdate.setSites(objUpdate.site, {
                        transaction: objUpdate.transaction
                    });
                }
            })
            .then(function(relRosterSiteUpdated) {
                defer.resolve(relRosterSiteUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('UpdateRelRosterSite.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
