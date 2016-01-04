var $q = require('q');
module.exports = function(consultationUID, userInfo) {
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            var consultationObject = null;
            if (HelperService.CheckExistData(consultationUID)) {
                Consultation.findOne({
                        where: {
                            UID: consultationUID
                        },
                        transaction: t
                    })
                    .then(function(consultRes) {
                        if (HelperService.CheckExistData(consultRes) &&
                            !_.isEmpty(consultRes)) {
                            consultationObject = consultRes;
                            return consultationObject.setConsultationData([], {
                                transaction: t,
                            });
                        } else {
                            defer.reject('find.consultation.not.found');
                        }
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(relConsultationDataDeleted) {
                        return consultationObject.setAppointments([], {
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(relConsultationDataDeleted) {
                        return consultationObject.getConsultationData({
                            attributes: ['ID'],
                            transaction: t,
                            raw: true
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(consultationData) {
                        var arrConsultationDataUID = _.map(consultationData, 'ID');
                        return ConsultationData.destroy({
                            where: {
                                UID: {
                                    $in: arrConsultationDataUID
                                }
                            },
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(consultationDataDeleted) {
                        return Consultation.destroy({
                            where: {
                                UID: consultationUID
                            },
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(consultationDeleted) {
                        defer.resolve({
                            transaction: t,
                            status: 'success'
                        });
                    }, function(err) {
                        defer.reject(err);
                    });
            } else {
                defer.reject('param.consultation.UID.not.found');
            }
            return defer.promise;
        });
};
