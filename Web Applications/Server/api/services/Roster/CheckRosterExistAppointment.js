module.exports = function(objCheck) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    require('moment-range');
    if (!_.isEmpty(objCheck) &&
        !_.isEmpty(objCheck.where) &&
        !_.isEmpty(objCheck.userAccount)) {
        var whereClauseUserAccount = {};
        var arrRoster = null;
        var arrAppt = null;
        _.forEach(objCheck.userAccount, function(valueKey, indexKey) {
            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                whereClauseUserAccount[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
            } else if (!_.isArray(valueKey) &&
                !_.isObject(valueKey)) {
                whereClauseUserAccount[indexKey] = valueKey;
            }
        });
        var arrayUIDRosterUpdate = _.map(objCheck.where, 'UID');
        //get all Roster update
        Roster.findAll({
                attributes: Services.AttributesRoster.Roster(),
                include: [{
                    attributes: ['ID'],
                    model: UserAccount,
                    required: true,
                    where: whereClauseUserAccount
                }],
                where: {
                    UID: {
                        $in: arrayUIDRosterUpdate,
                    },
                    Enable: 'Y'
                },
                transaction: objCheck.transaction
            })
            .then(function(rosterRes) {
                if (!_.isEmpty(rosterRes)) {
                    arrRoster = JSON.parse(JSON.stringify(rosterRes));
                    var arrDataExistAppt = [];
                    //loop arrRoster get all Appointment in FromTime - ToTime of Roster
                    return sequelize.Promise.each(arrRoster, function(valueRosterUser, indexRosterUser) {
                            if (!_.isEmpty(valueRosterUser) &&
                                HelperService.CheckExistData(valueRosterUser.FromTime) &&
                                HelperService.CheckExistData(valueRosterUser.ToTime)) {
                                return Appointment.findAll({
                                        attributes: Services.AttributesAppt.Appointment(),
                                        include: [{
                                            attributes: Services.AttributesAppt.Doctor(),
                                            model: Doctor,
                                            required: true,
                                            include: [{
                                                attributes: ['ID'],
                                                model: UserAccount,
                                                required: true,
                                                where: whereClauseUserAccount
                                            }]
                                        }],
                                        where: {
                                            FromTime: {
                                                $gte: moment(valueRosterUser.FromTime).toDate()
                                            },
                                            ToTime: {
                                                $lte: moment(valueRosterUser.ToTime).toDate()
                                            },
                                            Enable: 'Y'
                                        },
                                        transaction: objCheck.transaction,
                                        raw: true
                                    })
                                    .then(function(apptOnRoster) {
                                        if (!_.isEmpty(apptOnRoster)) {
                                            //find FromTime, ToTime update for Roster
                                            var FromTimeUpdate = null;
                                            var ToTimeUpdate = null;
                                            var rosterCurrentUpdate = null;
                                            _.forEach(objCheck.where, function(valueRosterUpdate, indexRosterUpdate) {
                                                if (valueRosterUpdate.UID === valueRosterUser.UID) {
                                                    FromTimeUpdate = moment(valueRosterUpdate.FromTime).format('YYYY-MM-DD HH:mm:ss Z');
                                                    ToTimeUpdate = moment(valueRosterUpdate.ToTime).format('YYYY-MM-DD HH:mm:ss Z');
                                                    rosterCurrentUpdate = _.extend({}, valueRosterUpdate);
                                                }
                                            });
                                            var rangeRosterUpdate = moment.range(FromTimeUpdate, ToTimeUpdate);
                                            _.forEach(apptOnRoster, function(valueAppt, indexAppt) {
                                                var FromTimeAppt = moment(valueAppt.FromTime).format('YYYY-MM-DD HH:mm:ss Z');
                                                var ToTimeAppt = moment(valueAppt.ToTime).format('YYYY-MM-DD HH:mm:ss Z');
                                                if ((!moment(FromTimeAppt).within(rangeRosterUpdate) &&
                                                        !_.isEmpty(valueAppt.FromTime)) ||
                                                    (!moment(ToTimeAppt).within(rangeRosterUpdate) &&
                                                        !_.isEmpty(valueAppt.ToTime))) {
                                                    var objRosterExistAppt = _.extend({}, rosterCurrentUpdate);
                                                    objRosterExistAppt.Appointment = _.extend({}, valueAppt);
                                                    arrDataExistAppt.push(objRosterExistAppt);
                                                }
                                            });
                                        }
                                    }, function(err) {
                                        defer.reject(err);
                                    });
                            }
                        })
                        .then(function(checkExistApptComplete) {
                            if (!_.isEmpty(arrDataExistAppt)) {
                                if (!_.isEmpty(arrDataExistAppt)) {
                                    arrDataExistAppt = _.uniq(arrDataExistAppt, 'UID');
                                    defer.reject({
                                        status: 'existAppt',
                                        dataExistAppt: arrDataExistAppt
                                    });
                                } else {
                                    defer.resolve({
                                        status: 'success'
                                    });
                                }
                            } else {
                                defer.resolve({
                                    status: 'success'
                                });
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                } else {
                    var error = new Error('DestroyRoster.not.exist');
                    defer.reject(error);
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