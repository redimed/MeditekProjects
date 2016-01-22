module.exports = function(objCreate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objCreate) &&
        _.isArray(objCreate.data) &&
        !_.isEmpty(objCreate.data)) {
        var arrRosterCreated = [];
        sequelize.Promise.each(objCreate.data, function(valueRoster, indexRoster) {
                if (!_.isEmpty(valueRoster)) {
                    var objectCreateRoster = {
                        data: valueRoster,
                        transaction: objCreate.transaction
                    };
                    return Services.CreateRoster(objectCreateRoster)
                        .then(function(rosterCreated) {
                            if (!_.isEmpty(rosterCreated)) {
                                arrRosterCreated.push(rosterCreated);
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                }
            })
            .then(function(rosterCreated) {
                defer.resolve(arrRosterCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('objCreate.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
