var $q = require('q');
module.exports = function(objUpdate) {
    var defer = $q.defer();
    var consultationObject = null;
    if (HelperService.CheckExistData(objUpdate) &&
        HelperService.CheckExistData(objUpdate.data) &&
        !_.isEmpty(objUpdate.data) &&
        _.isArray(objUpdate.data)) {
        sequelize.Promise.each(objUpdate.data, function(valueConsultation, indexConsultation) {
                if (HelperService.CheckExistData(valueConsultation) &&
                    HelperService.CheckExistData(valueConsultation.UID)) {
                    return Consultation.update({
                            ModifiedBy: objUpdate.userInfo.ID
                        }, {
                            where: {
                                UID: valueConsultation.UID
                            },
                            transaction: objUpdate.transaction,
                            individualHooks: true
                        })
                        .then(function(consultationUpdated) {
                            if (HelperService.CheckExistData(consultationUpdated) &&
                                HelperService.CheckExistData(consultationUpdated[1]) &&
                                !_.isEmpty(consultationUpdated[1])) {
                                var consultationObject = consultationUpdated[1];
                                return sequelize.Promise.each(consultationObject, function(valueConsultObj, indexConsultObj) {
                                    if (HelperService.CheckExistData(valueConsultObj) &&
                                        !_.isEmpty(valueConsultObj)) {
                                        consultationObject = valueConsultObj;
                                        return valueConsultObj.setConsultationData([], {
                                                transaction: objUpdate.transaction
                                            })
                                            .then(function(relConsultationDataDeleted) {
                                                return valueConsultObj.getConsultationData({
                                                    attributes: ['ID'],
                                                    transaction: objUpdate.transaction,
                                                    raw: true
                                                });
                                            }, function(err) {
                                                defer.reject(err);
                                            })
                                            .then(function(consultDataRes) {
                                                var arrConsultData = _.map(consultDataRes, 'ID');
                                                return ConsultationData.destroy({
                                                    where: {
                                                        ID: {
                                                            $in: arrConsultData
                                                        }
                                                    },
                                                    transaction: objUpdate.transaction,
                                                });
                                            }, function(err) {
                                                defer.reject(err);
                                            });
                                    }
                                });
                            }
                        }, function(err) {
                            defer.reject(err);
                        })
                        .then(function(consultationDataRes) {
                            if (HelperService.CheckExistData(valueConsultation) &&
                                HelperService.CheckExistData(valueConsultation.ConsultationData) &&
                                !_.isEmpty(valueConsultation.ConsultationData)) {
                                var objectCreateConsultationData = {
                                    data: valueConsultation.ConsultationData,
                                    transaction: objUpdate.transaction
                                };
                                return Services.BulkCreateConsultationData(objectCreateConsultationData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        })
                        .then(function(consultDataCreated) {
                            if (HelperService.CheckExistData(consultDataCreated) &&
                                !_.isEmpty(consultDataCreated)) {
                                var consultationDataCreated =
                                    JSON.parse(JSON.stringify(consultDataCreated));
                                var arrayConsultDataUnique = _.map(_.groupBy(consultationDataCreated, function(CD) {
                                    return CD.ID;
                                }), function(subGrouped) {
                                    return subGrouped[0].ID;
                                });
                                var objRelConsultData = {
                                    data: arrayConsultDataUnique,
                                    transaction: objUpdate.transaction,
                                    consultationObject: consultationObject
                                };
                                return Services.RelConsultationData(objRelConsultData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                }
            })
            .then(function(consultationUpdated) {
                defer.resolve(consultationUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objUpdate.data.BulkUpdateConsultation.failed');
    }
    return defer.promise;
};
