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
                                        return valuePatientAdmissionObj.setAdmissionData([], {
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
                            if (HelperService.CheckExistData(valuePatientAdmission) &&
                                HelperService.CheckExistData(valuePatientAdmission.AdmissionData) &&
                                !_.isEmpty(valuePatientAdmission.AdmissionData)) {
                                var objectCreatePatientAdmissionData = {
                                    data: valuePatientAdmission.AdmissionData,
                                    transaction: objUpdate.transaction
                                };
                                return Services.BulkCreatePatientAdmissionData(objectCreatePatientAdmissionData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        })
                        .then(function(patientAdmissinDataCreatedRes) {
                            if (HelperService.CheckExistData(patientAdmissinDataCreatedRes) &&
                                !_.isEmpty(patientAdmissinDataCreatedRes)) {
                                var patientAdmissinDataCreated =
                                    JSON.parse(JSON.stringify(patientAdmissinDataCreatedRes));
                                var arrayPatientAdmissionDataUnique = _.map(_.groupBy(patientAdmissinDataCreated, function(CD) {
                                    return CD.ID;
                                }), function(subGrouped) {
                                    return subGrouped[0].ID;
                                });
                                var objRelAdmissionData = {
                                    data: arrayPatientAdmissionDataUnique,
                                    transaction: objUpdate.transaction,
                                    patientAdmissionObject: patientAdmissionObject
                                };
                                return Services.RelAdmissionData(objRelAdmissionData);
                            }
                        }, function(err) {
                            defer.reject(err);
                        });
                }
            })
            .then(function(patientAdmissionUpdated) {
                defer.resolve(patientAdmissionUpdated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objUpdate.data.BulkUpdatePatientAdmission.failed');
    }
    return defer.promise;
};
