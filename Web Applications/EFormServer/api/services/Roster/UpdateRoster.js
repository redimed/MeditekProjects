module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objUpdate) &&
        !_.isEmpty(objUpdate.data)) {
        Roster.update(objUpdate.data, {
                where: objUpdate.where,
                transaction: objUpdate.transaction,
                individualHooks: true,
                raw: true
            })
            .then(function(rosterUpdated) {
                defer.resolve(rosterUpdated);
            }, function(err) {
                defer.reject(err);
            });
    }
    return defer.promise;
};
