module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    sequelize.transaction()
        .then(function(t) {
            if (!_.isEmpty(data) &&
                !_.isEmpty(data.Roster) &&
                !_.isEmpty(data.UserAccount) &&
                HelperService.CheckExistData(data.Roster.UID)) {
                var arrayRosterUID = null;
                if (data.Roster.CaseOccurance == 'Y') {
                    return Roster.findOne({
                            attributes: Services.AttributesRoster.Roster(),
                            where: {
                                UID: data.Roster.UID,
                                Enable: 'Y'
                            },
                            transaction: t,
                            raw: true
                        })
                        .then(function(rosterRes) {
                            if (!_.isEmpty(rosterRes)) {
                                rosterRes.FromTime = moment(rosterRes.FromTime).format('YYYY-MM-DD HH:mm:ss Z');
                                rosterRes.ToTime = moment(rosterRes.ToTime).format('YYYY-MM-DD HH:mm:ss Z');
                                rosterRes.EndRecurrence = moment(rosterRes.EndRecurrence).format('YYYY-MM-DD HH:mm:ss Z');
                                var rosterRepeat = Services.GetDataRoster.GetRosterRepeat(rosterRes, userInfo);
                                if (!_.isEmpty(rosterRepeat) &&
                                    _.isArray(rosterRepeat)) {
                                    var arrWhereClauseRoster = [];
                                    _.forEach(rosterRepeat, function(valueRoster, indexRoster) {
                                        if (!_.isEmpty(valueRoster) &&
                                            HelperService.CheckExistData(valueRoster.FromTime) &&
                                            HelperService.CheckExistData(valueRoster.ToTime)) {
                                            var objFilterTemp = {
                                                FromTime: {
                                                    $gte: valueRoster.FromTime
                                                },
                                                ToTime: {
                                                    $lte: valueRoster.ToTime
                                                }
                                            };
                                            arrWhereClauseRoster.push(objFilterTemp);
                                        }
                                    });
                                    if (!_.isEmpty(arrWhereClauseRoster)) {
                                        return Roster.findAll({
                                            attributes: Services.AttributesRoster.Roster(),
                                            include: [{
                                                model: UserAccount,
                                                required: true,
                                                where: {
                                                    UID: data.UserAccount.UID,
                                                    Enable: 'Y'
                                                }
                                            }],
                                            where: {
                                                $or: arrWhereClauseRoster,
                                                Enable: 'Y'
                                            },
                                            raw: true
                                        });
                                    } else {
                                        var error = new Error('DestroyRoster.repeat.not.exist');
                                        defer.reject({
                                            error: error,
                                            transaction: t
                                        });
                                    }
                                } else {
                                    var error = new Error('DestroyRoster.repeat.not.exist');
                                    defer.reject({
                                        error: error,
                                        transaction: t
                                    });
                                }
                            } else {
                                var error = new Error('DestroyRoster.not.exist');
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
                        .then(function(arrRosterDestroy) {
                            if (!_.isEmpty(arrRosterDestroy)) {
                                //check exist appt
                                arrayRosterUID = _.map(_.groupBy(arrRosterDestroy, function(R) {
                                    return R.UID;
                                }), function(subGrouped) {
                                    return subGrouped[0].UID;
                                });
                                var objCheckExistAppointment = {
                                    where: arrayRosterUID,
                                    userAccount: data.UserAccount,
                                    transaction: t
                                };
                                return Services.CheckRosterExistAppointment(objCheckExistAppointment);
                            } else {
                                var error = new Error('data.Roster.not.exist');
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
                        .then(function(checkExistApptOk) {
                            if (!_.isEmpty(arrayRosterUID)) {
                                return Roster.update({
                                    Enable: 'N'
                                }, {
                                    where: {
                                        UID: {
                                            $in: arrayRosterUID
                                        }
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                dataExistAppt: err,
                                transaction: t
                            });
                        })
                        .then(function(rosterDeleted) {
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
                } else if (data.Roster.CaseOccurance == 'N') {
                    var objCheckExistAppointment = {
                        where: [data.Roster.UID],
                        userAccount: data.UserAccount,
                        transaction: t
                    };
                    return Services.CheckRosterExistAppointment(objCheckExistAppointment)
                        .then(function(responseCheckOk) {
                            //destoy Roster
                            return Roster.update({
                                Enable: 'N'
                            }, {
                                where: {
                                    UID: data.Roster.UID
                                },
                                transaction: t
                            });
                        }, function(err) {
                            defer.reject({
                                dataExistAppt: err,
                                transaction: t
                            });
                        })
                        .then(function(rosterDeleted) {
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
                } else {
                    var error = new Error('DestroyRoster.case.not.exist');
                    defer.reject({
                        error: error,
                        transaction: t
                    });
                }
            } else {
                var error = new Error('data.Roster.failed(UID,IsRecurrence)not.exist');
                defer.reject({
                    error: error,
                    transaction: t
                });
            }
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
