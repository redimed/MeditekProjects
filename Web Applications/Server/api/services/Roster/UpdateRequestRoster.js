module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Roster) &&
        !_.isEmpty(data.UserAccount) &&
        !_.isEmpty(data.Service) &&
        HelperService.CheckExistData(data.Roster.FromTime) &&
        HelperService.CheckExistData(data.Roster.ToTime)) {
        var arrObjectRosterUpdated = null;
        sequelize.transaction()
            .then(function(t) {
                    var objectCheckExistAppt = {
                        data: [data.Roster.UID],
                        transaction: t,
                        userAccount: data.UserAccount
                    };
                    return Service.CheckRosterExistAppointment(objectCheckExistAppt)
                        .then(function(checkExistApptOk) {
                            var objectUpdateRoster = {
                                data: [data.Roster],
                                transaction: t
                            };
                            return Services.BulkUpdateRoster(objectUpdateRoster)
                                .then(function(rosterUpdated) {
                                    arrObjectRosterUpdated = rosterUpdated;
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
                                            transaction: t,
                                            raw: true
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
                                        var objectUpdateRelRosterService = {
                                            data: arrObjectRosterUpdated,
                                            service: serviceRes.ID,
                                            transaction: t
                                        };
                                        return Services.UpdateRelRosterService(objectUpdateRelRosterService);
                                    }
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                })
                                .then(function(relRosterServiceUpdated) {
                                    if (data.Roster.IsRecurrence === 'Y' &&
                                        HelperService.CheckExistData(data.Roster.EndRecurrence) &&
                                        (moment(data.Roster.EndRecurrence, 'YYYY-MM-DD Z', true).isValid() ||
                                            moment(data.Roster.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z', true).isValid())) {
                                        //update all roster recurrence
                                        var rosterRepeat = Services.GetDataRoster.GetRosterRepeat(data.Roster, userInfo);
                                        if (!_.isEmpty(rosterRepeat)) {
                                            rosterRepeat.splice(0, 1);
                                            if (!_.isEmpty(rosterRepeat)) {
                                                var objectCreateRoster = {
                                                    data: rosterRepeat,
                                                    transaction: t
                                                };
                                                return Services.BulkCreateRoster(objectCreateRoster);
                                            }
                                        }
                                    }
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                })
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
                                        status: 'success',
                                        transaction: t
                                    });
                                }, function(err) {
                                    defer.reject({
                                        error: err,
                                        transaction: t
                                    });
                                });
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        });
                },
                function(err) {
                    defer.reject(err);
                });
    } else {
        var error = new Error('UpdateRequestRoster.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
