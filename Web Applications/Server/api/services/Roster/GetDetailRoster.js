module.exports = function(rosterUID) {
    var $q = require('q');
    var defer = $q.defer();
    Roster.findOne({
            attributes: Services.AttributesRoster.Roster(),
            where: {
                UID: rosterUID,
                Enable: 'Y'
            }
        })
        .then(function(rosterRes) {
            defer.resolve({
                data: rosterRes
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
