module.exports = function(objCreate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objCreate) &&
        !_.isEmpty(objCreate.data)) {
        Roster.create(objCreate.data, {
                transaction: objCreate.transaction
            })
            .then(function(rosterCreated) {
                defer.resolve(rosterCreated);
            }, function(err) {
                defer.reject(err);
            });
    }
    return defer.promise;
};
