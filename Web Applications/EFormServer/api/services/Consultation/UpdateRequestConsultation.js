var $q = require('q');
var moment = require('moment');
module.exports = function(data, userInfo) {
    var defer = $q.defer();
    sequelize.transaction()
        .then(function(t) {
            var Consultations = data.Consultations;
            var whereClause = {};
            _.forEach(data, function(valueData, indexData) {
                if (HelperService.CheckExistData(valueData) &&
                    !_.isObject(valueData) &&
                    !_.isArray(valueData)) {
                    if (moment(valueData, 'YYYY-MM-DD Z', true).isValid() ||
                        moment(valueData, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                        whereClause[indexData] = moment(valueData, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                    } else {
                        whereClause[indexData] = valueData;
                    }
                }
            });
            if (HelperService.CheckExistData(whereClause) &&
                HelperService.CheckExistData(Consultations) &&
                !_.isEmpty(whereClause) &&
                !_.isEmpty(Consultations)) {
                return Appointment.findOne({
                        attributes: ['ID'],
                        where: whereClause,
                        transaction: t
                    })
                    .then(function(objAppt) {
                        if (HelperService.CheckExistData(objAppt) &&
                            !_.isEmpty(objAppt)) {
                            var objectUpdateConsultation = {
                                data: Consultations,
                                transaction: t,
                                userInfo: userInfo
                            };
                            return Services.BulkUpdateConsultation(objectUpdateConsultation);
                        } else {
                            var error = new Error('UpdateRequestConsultation.Appointment.not.exist');
                            defer.reject(error);
                        }
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(consultationUpdated) {
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    });
            } else {
                defer.reject({
                    transaction: t,
                    error: new Error('UpdateConsultation.data.failed')
                });
            }
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
