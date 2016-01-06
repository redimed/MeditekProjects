var $q = require('q');
module.exports = function(objUpdate) {
    var defer = $q.defer();
    var admissionObject = null;
    if (HelperService.CheckExistData(objUpdate) &&
        HelperService.CheckExistData(objUpdate.data) &&
        !_.isEmpty(objUpdate.data) &&
        _.isArray(objUpdate.data)) {
        sequelize.Promise.each(objUpdate.data, function(valueAdmission, indexAdmission) {
                if (HelperService.CheckExistData(valueAdmission) &&
                    HelperService.CheckExistData(valueAdmission.UID)) {
                    return Admission.update({
                            ModifiedBy: objUpdate.userInfo.ID
                        }, {
                            where: {
                                UID: valueAdmission.UID
                            },
                            transaction: objUpdate.transaction,
                            individualHooks: true
                        })
                        .then(function(admissionUpdated) {
                            if (HelperService.CheckExistData(admissionUpdated) &&
                                HelperService.CheckExistData(admissionUpdated[1]) &&
                                !_.isEmpty(admissionUpdated[1])) {
                                var admissionObject = admissionUpdated[1];
                                return sequelize.Promise.each(admissionObject, function(valueAdmissionObj, indexConsultObj) {
                                    if (HelperService.CheckExistData(valueAdmissionObj) &&
                                        !_.isEmpty(valueAdmissionObj)) {
                                        admissionObject = valueAdmissionObj;
                                        return valueAdmissionObj.setAdmissionData([], {
                                                transaction: objUpdate.transaction
                                            })
                                            .then(function(relConsultationDataDeleted) {
                                                return valueAdmissionObj.getConsultationData({
                                                    attributes: ['ID'],
                                                    transaction: objUpdate.transaction,
                                                    raw: true
                                                });
                                            }, function(err) {
                                                defer.reject(err);
                                            })
                                            .then(function(admissionDataRes) {
                                                var arrAdmissionData = _.map(admissionDataRes, 'ID');
                                                return AdmissionData.destroy({
                                                    where: {
                                                        ID: {
                                                            $in: arrAdmissionData
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
                        .then(function(admissionDataRes) {
                            if (HelperService.CheckExistData(valueAdmission) &&
                                HelperService.CheckExistData(valueAdmission.AdmissionData) &&
                                !_.isEmpty(valueAdmission.AdmissionData)) {
                                var objectCreateAdmissionData = {
                                    data: valueAdmission.AdmissionData,
                                    transaction: objUpdate.transaction
                                };
                                return Services.BulkCreateAdmissionData(objectCreateAdmissionData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        })
                        .then(function(admissinDataCreatedRes) {
                            if (HelperService.CheckExistData(admissinDataCreatedRes) &&
                                !_.isEmpty(admissinDataCreatedRes)) {
                                var admissionDataCreated =
                                    JSON.parse(JSON.stringify(admissinDataCreatedRes));
                                var arrayAdmissionDataUnique = _.map(_.groupBy(admissionDataCreated, function(CD) {
                                    return CD.ID;
                                }), function(subGrouped) {
                                    return subGrouped[0].ID;
                                });
                                var objRelAdmissionData = {
                                    data: arrayAdmissionDataUnique,
                                    transaction: objUpdate.transaction,
                                    admissionObject: admissionObject
                                };
                                return Services.RelAdmissionData(objRelAdmissionData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                }
            })
            .then(function(admissionUpdated) {
                defer.resolve(admissionUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objUpdate.data.BulkUpdateAdmission.failed');
    }
    return defer.promise;
};
