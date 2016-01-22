module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    sequelize.transaction()
        .then(function(t) {
            if (!_.isEmpty(data) &&
                HelperService.CheckExistData(data.UID) &&
                HelperService.CheckExistData(data.IsRecurrence)) {
                if (data.IsRecurrence == 'Y') {
                    return Roster.findAll({
                            attributes: Services.AttributesRoster.Roster(),
                            where: {
                                Enable: 'Y',
                                UID: data.UID
                            },
                            transaction: t
                        })
                        .then(function(rosterRes) {
                            rosterRes = JSON.parse(JSON.stringify(rosterRes));
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        });
                } else {
                    var objCheckExistAppointment = {
                        data: data.UID,
                        transaction: t
                    };
                    return Services.CheckRosterExistAppointment(objCheckExistAppointment)
                        .then(function(responseCheckOk) {
                            //destoy Roster
                            return Roster.update({
                                Enable: 'N'
                            }, {
                                where: {
                                    UID: data.UID
                                },
                                transaction: t
                            });
                        }, function(err) {
                            if (!_.isEmpty(err) &&
                                !_.isEmpty(err.data)) {
                                defer.reject(err);
                            } else {
                                defer.reject({
                                    error: err,
                                    transaction: t
                                });
                            }
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
                }
            } else {
                var error = new Error('data.failed(UID,IsRecurrence)not.exist');
                defer.reject({
                    error: error,
                    transaction: t
                });
            }
        }, function(err) {
            defer.reject(err);
        })
    return defer.promise;
};
