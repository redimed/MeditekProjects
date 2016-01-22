module.exports = function(objCheckOverlap) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    require('moment-range');
    var arrayRosterOverlap = [];
    if (!_.isEmpty(objCheckOverlap) &&
        !_.isEmpty(objCheckOverlap.data) &&
        !_.isEmpty(objCheckOverlap.userAccount)) {
        var whereClauseUserAccount = {};
        _.forEach(objCheckOverlap.userAccount, function(valueKey, indexKey) {
            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                whereClauseUserAccount[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
            } else if (!_.isArray(valueKey) &&
                !_.isObject(valueKey)) {
                whereClauseUserAccount[indexKey] = valueKey;
            }
        });
        Roster.findAll({
                attributes: ['FromTime', 'ToTime'],
                include: [{
                    attributes: ['ID'],
                    model: UserAccount,
                    where: whereClauseUserAccount,
                    required: true
                }],
                raw: true
            })
            .then(function(arrRoster) {
                if (!_.isEmpty(arrRoster) &&
                    _.isArray(arrRoster)) {
                    _.forEach(objCheckOverlap.data, function(valueRosterCheck, indexRosterCheck) {
                        _.forEach(arrRoster, function(valueRosterUser, indexRosterUser) {
                            var fromTimeCheck = moment(valueRosterCheck.FromTime).format('YYYY-MM-DD HH:mm:ss');
                            var toTimeCheck = moment(valueRosterCheck.ToTime).format('YYYY-MM-DD HH:mm:ss');
                            var fromTimeUser = moment(valueRosterUser.FromTime).format('YYYY-MM-DD HH:mm:ss');
                            var toTimeUser = moment(valueRosterUser.ToTime).format('YYYY-MM-DD HH:mm:ss');
                            var rangeRosterCheck = moment.range(fromTimeCheck, toTimeCheck);
                            var rangeRosterUser = moment.range(fromTimeUser, toTimeUser);
                            if (rangeRosterCheck.overlaps(rangeRosterUser) === true) {
                                arrayRosterOverlap.push(valueRosterCheck);
                            }
                        });
                    });
                    if (!_.isEmpty(arrayRosterOverlap)) {
                        arrayRosterOverlap = _.uniq(arrayRosterOverlap, 'UID');
                        defer.reject(arrayRosterOverlap);
                    } else {
                        defer.resolve(arrayRosterOverlap);
                    }
                } else {
                    defer.resolve({
                        status: 'success'
                    });
                }
            }, function(err) {
                defer.reject(err);
            })
    } else {
        var error = new Error('objCheckOverlap.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
