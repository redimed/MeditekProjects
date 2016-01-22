module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Roster) &&
        !_.isEmpty(data.UserAccount) &&
        !_.isEmpty(data.Service) &&
        !_.isEmpty(data.Site)) {
        sequelize.transaction()
            .then(function(t) {
                var rosterRepeat = Services.GetDataRoster.GetRosterRepeat(data.Roster, userInfo);
                if (_.isArray(rosterRepeat) &&
                    !_.isEmpty(rosterRepeat)) {
                    var objectCheckOverlap = {
                        data: rosterRepeat,
                        transaction: t,
                        userAccount: data.UserAccount
                    };
                    return Services.CheckOverlap(objectCheckOverlap)
                        .then(function(checkOk) {
                            var objectCreateRoster = {
                                data: rosterRepeat,
                                userInfo: userInfo,
                                transaction: t
                            };
                            var arrayRosterID = null;
                            return Services.BulkCreateRoster(objectCreateRoster)
                                .then(function(rosterCreated) {
                                    var rosterCreated =
                                        JSON.parse(JSON.stringify(rosterCreated));
                                    arrayRosterID = _.map(_.groupBy(rosterCreated, function(R) {
                                        return R.ID;
                                    }), function(subGrouped) {
                                        return subGrouped[0].ID;
                                    });
                                    if (!_.isEmpty(data.UserAccount)) {
                                        var whereClause = {};
                                        _.forEach(data.UserAccount, function(valueKey, indexKey) {
                                            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                            } else if (!_.isArray(valueKey) &&
                                                !_.isObject(valueKey)) {
                                                whereClause[indexKey] = valueKey;
                                            }
                                        });
                                        return UserAccount.findOne({
                                            attributes: ['ID'],
                                            where: whereClause,
                                            transaction: t
                                        });
                                    } else {
                                        var error = new Error('userAccount.not.exist');
                                        defer.reject({
                                            error: error,
                                            transaction: t
                                        });
                                    }
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                })
                                .then(function(userAccountRes) {
                                    if (!_.isEmpty(userAccountRes)) {
                                        return userAccountRes.addRosters(arrayRosterID, {
                                            transaction: t
                                        });
                                    } else {
                                        var error = new Error('userAccount.not.exist');
                                        defer.reject({
                                            error: error,
                                            transaction: t
                                        });
                                    }
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                })
                                .then(function(relUserAccountRosterCreated) {
                                    if (!_.isEmpty(data.Service)) {
                                        var whereClause = {};
                                        _.forEach(data.Service, function(valueKey, indexKey) {
                                            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                                whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                            } else if (!_.isArray(valueKey) &&
                                                !_.isObject(valueKey)) {
                                                whereClause[indexKey] = valueKey;
                                            }
                                        });
                                        return Service.findOne({
                                            attributes: ['ID'],
                                            where: whereClause,
                                            transaction: t
                                        });
                                    } else {
                                        var error = new Error('service.not.exist');
                                        defer.reject({
                                            error: error,
                                            transaction: t
                                        });
                                    }
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                })
                                .then(function(serviceRes) {
                                    if (!_.isEmpty(serviceRes)) {
                                        return serviceRes.addRosters(arrayRosterID, {
                                            transaction: t
                                        });
                                    } else {
                                        var error = new Error('service.not.exist');
                                        defer.reject({
                                            error: error,
                                            transaction: t
                                        });
                                    }
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                })
                                .then(function(relRosterServiceCreated) {
                                    defer.resolve({
                                        transaction: t,
                                        status: 'success'
                                    });
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                });
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                data: err
                            });
                        });
                } else {
                    var error = new Error('RosterRepeat.not.exist');
                    defer.reject(error);
                }
            }, function(err) {
                defer.reject({
                    error: err,
                    transaction: t
                });
            });
    } else {
        var error = new Error('Roster.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
