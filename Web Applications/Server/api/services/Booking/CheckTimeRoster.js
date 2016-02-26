module.exports = function(objCheck) {
    var $q = require('q');
    var moment = require('moment');
    var defer = $q.defer();
    if (!_.isEmpty(objCheck) &&
        !_.isEmpty(objCheck.data) &&
        HelperService.CheckExistData(objCheck.data.FromTime) &&
        HelperService.CheckExistData(objCheck.data.ToTime)) {
        var fromTime = moment(objCheck.data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').toDate();
        var toTime = moment(objCheck.data.toTime, 'YYYY-MM-DD HH:mm:ss Z').toDate();
        var whereClauseDoctor = {};
        _.forEach(objCheck.where, function(valueKey, indexKey) {
            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                whereClauseDoctor[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
            } else if (!_.isArray(valueKey) &&
                !_.isObject(valueKey)) {
                whereClauseDoctor[indexKey] = valueKey;
            }
        });
        Roster.count({
                include: [{
                    model: UserAccount,
                    required: true,
                    include: [{
                        model: Doctor,
                        required: true,
                        where: whereClauseDoctor
                    }]
                }],
                where: {
                    FromTime: {
                        $lte: objCheck.data.FromTime
                    },
                    ToTime: {
                        $gte: objCheck.data.ToTime
                    }
                },
                transaction: objCheck.transaction
            })
            .then(function(numberofRoster) {
                if (numberofRoster === 0) {
                    defer.reject({ status: 'withoutRoster' });
                } else {
                    defer.resolve({ status: 'CheckTimeRoster.Ok' });
                }
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('CheckTimeRoster.objCheck.failed');
        defer.reject(error);
    }
    return defer.promise;
};
