var $q = require('q');
var moment = require('moment');
module.exports = function(data, userInfo) {
    var defer = $q.defer();
    return sequelize.transaction()
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
                Appointment.findOne({
                        attributes: ['ID'],
                        where: whereClause,
                        transaction: t
                    })
                    .then(function(objAppt) {
                        var objectUpdateConsultation = {
                            data: Consultations,
                            transaction: t,
                            userInfo: userInfo
                        };
                        return Services.BulkUpdateConsultation(objectUpdateConsultation);
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(consultationUpdated) {
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }, function(err) {
                        defer.reject(err);
                    });
            } else {
                defer.reject('UpdateConsultation.data.failed')
            }
            return defer.promise;
        });
};
