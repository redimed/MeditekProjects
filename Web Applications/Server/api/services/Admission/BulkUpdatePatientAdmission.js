var $q = require('q');
module.exports = function(objUpdate) {
    var defer = $q.defer();
    var patientAdmissionObject = null;
    if (HelperService.CheckExistData(objUpdate) &&
        HelperService.CheckExistData(objUpdate.data) &&
        !_.isEmpty(objUpdate.data) &&
        _.isArray(objUpdate.data)) {
        sequelize.Promise.each(objUpdate.data, function(valuePatientAdmission, indexPatientAdmission) {
                if (HelperService.CheckExistData(valuePatientAdmission) &&
                    HelperService.CheckExistData(valuePatientAdmission.UID)) {
                    return Admission.update({
                            ModifiedBy: objUpdate.userInfo.ID
                        }, {
                            where: {
                                UID: valuePatientAdmission.UID
                            },
                            transaction: objUpdate.transaction,
                            individualHooks: true
                        })
                        .then(function(patientAdmissionUpdated) {
                            if (HelperService.CheckExistData(patientAdmissionUpdated) &&
                                HelperService.CheckExistData(patientAdmissionUpdated[1]) &&
                                !_.isEmpty(patientAdmissionUpdated[1])) {
                                var patientAdmissionObject = patientAdmissionUpdated[1];
                                return sequelize.Promise.each(patientAdmissionObject, function(valuePatientAdmissionObj, indexConsultObj) {
                                    if (HelperService.CheckExistData(valuePatientAdmissionObj) &&
                                        !_.isEmpty(valuePatientAdmissionObj)) {
                                        patientAdmissionObject = valuePatientAdmissionObj;
                                        return valuePatientAdmissionObj.setConsultationData([], {
                                                transaction: objUpdate.transaction
                                            })
                                            .then(function(relConsultationDataDeleted) {
                                                return valuePatientAdmissionObj.getConsultationData({
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
                            if (HelperService.CheckExistData(valuePatientAdmission) &&
                                HelperService.CheckExistData(valuePatientAdmission.ConsultationData) &&
                                !_.isEmpty(valuePatientAdmission.ConsultationData)) {
                                var objectCreateConsultationData = {
                                    data: valuePatientAdmission.ConsultationData,
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
                                    patientAdmissionObject: patientAdmissionObject
                                };
                                return Services.RelConsultationData(objRelConsultData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                }
            })
            .then(function(consultNoteUpdated) {
                defer.resolve(consultNoteUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objUpdate.data.BulkUpdateConsultNote.failed');
    }
    return defer.promise;
};
