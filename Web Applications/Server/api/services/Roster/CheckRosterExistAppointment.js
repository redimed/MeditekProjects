module.exports = function(objCheck) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    if (!_.isEmpty(objCheck) &&
        !_.isEmpty(objCheck.data) &&
        !_.isEmpty(objCheck.userAccount)) {
        var whereClause = {};
        _.forEach(data.userAccount, function(valueKey, indexKey) {
            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
            } else if (!_.isArray(valueKey) &&
                !_.isObject(valueKey)) {
                whereClause[indexKey] = valueKey;
            }
        });
        Roster.findOne({
                attributes: Services.AttributesRoster.Roster(),
                include: [{
                    attributes: ['ID'],
                    model: UserAccount,
                    required: true,
                    where: whereClause
                }],
                where: {
                    UID: {
                        $in: objCheck.data,
                    },
                    Enable: 'Y'
                },
                transaction: objCheck.transaction
            })
            .then(function(rosterRes) {
                if (!_.isEmpty(rosterRes)) {
                    rosterRes = JSON.parse(JSON.stringify(rosterRes));
                    var fromTime = moment(rosterRes.FromTime).toDate();
                    var toTime = moment(rosterRes.ToTime).toDate();
                    return Appointment.findAll({
                        attributes: Services.AttributesAppt.Appointment(),
                        include: [{
                            attributes: Services.AttributesAppt.Doctor(),
                            model: Doctor,
                            required: true,
                            where: {
                                UserAccountID: rosterRes.UserAccounts[0].ID
                            }
                        }],
                        where: {
                            FromTime: {
                                $gte: fromTime
                            },
                            ToTime: {
                                $lte: toTime
                            }
                        },
                        transaction: objCheck.transaction
                    });
                } else {
                    var error = new Error('DestroyRoster.not.exist');
                    defer.reject(error);
                }
            }, function(err) {
                defer.reject(err);
            })
            .then(function(apptRes) {
                if (!_.isEmpty(apptRes)) {
                    var error = new Error('existAppointment');
                    error.data = apptRes;
                    defer.reject(error);
                } else {
                    defer.resolve('notExistAppointment');
                }
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('CheckRosterExistAppointment.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
