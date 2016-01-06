var $q = require('q');
module.exports = function(admissionUID, userInfo) {
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            var admissionObject = null;
            if (HelperService.CheckExistData(admissionUID)) {
                Admission.findOne({
                        where: {
                            UID: admissionUID
                        },
                        transaction: t
                    })
                    .then(function(admissionRes) {
                        if (HelperService.CheckExistData(admissionRes) &&
                            !_.isEmpty(admissionRes)) {
                            admissionObject = admissionRes;
                            return admissionObject.setAdmissionData([], {
                                transaction: t,
                            });
                        } else {
                            defer.reject('find.admission.not.found');
                        }
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(relAdmissionDataDeleted) {
                        return admissionObject.setAppointments([], {
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(relAdmissionDeleted) {
                        return admissionObject.getAdmissionData({
                            attributes: ['ID'],
                            transaction: t,
                            raw: true
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(admissionData) {
                        var arrAdmissionUID = _.map(admissionData, 'ID');
                        return ConsultationData.destroy({
                            where: {
                                UID: {
                                    $in: arrAdmissionUID
                                }
                            },
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(admissionDataDeleted) {
                        return Admission.destroy({
                            where: {
                                UID: admissionUID
                            },
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(admissionDeleted) {
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }, function(err) {
                        defer.reject(err);
                    });
            } else {
                defer.reject('param.admission.UID.not.found');
            }
            return defer.promise;
        });
};
