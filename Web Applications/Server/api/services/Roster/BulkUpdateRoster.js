module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objUpdate) &&
        !_.isEmpty(objUpdate.data) &&
        _.isArray(objUpdate.data)) {
        var arrRosterUpdated = [];
        sequelize.Promise.each(objUpdate.data, function(valueRoster, indexRoster) {
                if (!_.isEmpty(valueRoster) &&
                    HelperService.CheckExistData(valueRoster.FromTime) &&
                    HelperService.CheckExistData(valueRoster.ToTime)) {
                    var objectUpdateRoster = {
                        data: {
                            FromTime: valueRoster.FromTime,
                            ToTime: valueRoster.ToTime,
                            IsRecurrence: valueRoster.IsRecurrence,
                            RecurrenceType: valueRoster.RecurrenceType,
                            EndRecurrence: valueRoster.EndRecurrence
                        },
                        where: {
                            UID: valueRoster.UID
                        },
                        transaction: objUpdate.transaction
                    };
                    return Services.UpdateRoster(objectUpdateRoster)
                        .then(function(rosterUpdated) {
                            if (!_.isEmpty(rosterUpdated) &&
                                !_.isEmpty(rosterUpdated[1])) {
                                _.extend(arrRosterUpdated, rosterUpdated[1]);
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                }
            })
            .then(function(lisRosterUpdated) {
                defer.resolve(arrRosterUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('BulkUpdateRoster.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
