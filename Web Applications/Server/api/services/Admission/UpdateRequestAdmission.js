var $q = require('q');
var moment = require('moment');
module.exports = function(data, userInfo) {
    var defer = $q.defer();
    return sequelize.transaction()
        .then(function(t) {
            var admissions = data.Admissions;
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
                HelperService.CheckExistData(admissions) &&
                !_.isEmpty(whereClause) &&
                !_.isEmpty(admissions)) {
                Appointment.findOne({
                        attributes: ['ID'],
                        where: whereClause,
                        transaction: t
                    })
                    .then(function(objAppt) {
                        if (HelperService.CheckExistData(objAppt) &&
                            !_.isEmpty(objAppt)) {
                            var objectUpdateAdmission = {
                                data: admissions,
                                transaction: t,
                                userInfo: userInfo
                            };
                            return Services.BulkUpdateAdmission(objectUpdateAdmission);
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
                    .then(function(admissionUpdated) {
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    });
            } else {
                var error = new Error('UpdateRequestAdmission.data.failed')
                defer.reject(error);
            }
            return defer.promise;
        });
};
