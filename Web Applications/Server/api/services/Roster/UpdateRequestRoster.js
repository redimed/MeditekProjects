module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Roster) &&
        HelperService.CheckExistData(data.Roster.FromTime) &&
        HelperService.CheckExistData(data.Roster.ToTime)) {
        var arrObjectRosterUpdated = null;
        sequelize.transaction()
            .then(function(t) {
                    if (data.Roster.IsRecurrence === 'Y' &&
                        HelperService.CheckExistData(data.EndRecurrence)) {

                    } else if (data.Roster.IsRecurrence === 'N') {
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
                                        service: serviceRes,
                                        transaction: t
                                    };
                                }
                            }, function(err) {
                                defer.reject({
                                    error: err,
                                    transaction: t
                                });
                            })
                            .then(function(relRosterServiceUpdated) {
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
                    }
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
