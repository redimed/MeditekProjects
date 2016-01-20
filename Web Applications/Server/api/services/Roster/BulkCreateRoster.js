module.exports = function(objCreate) {
    var $q = require('q');
    var defer = $q.defer();
    if (HelperService.CheckExistData(objCreate) &&
        HelperService.CheckExistData(objCreate.data)) {
        Services.CheckOverlab(objCreate.data)
            .then(function(overlabRes) {
                if (!_.isEmpty(overlabRes) &&
                    overlabRes.overlab === false) {
                    var rosterRepeat = Services.GetDataRoster.GetRosterRepeat(objCreate.data, objCreate.userInfo);
                    if (_.isArray(rosterRepeat) &&
                        !_.isEmpty(rosterRepeat)) {
                        var arrRosterCreated = [];
                        sequelize.Promise.each(rosterRepeat, function(valueRoster, indexRoster) {
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
                        var error = new Error('roster.data.failed');
                        defer.reject(error);
                    }
                } else {
                    var error = new Error('roster.overlab');
                    defer.reject(error);
                }
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('objCreate.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
