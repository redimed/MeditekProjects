var $q = require('q');
module.exports = function(objUpdate) {
    var defer = $q.defer();
    var consultNoteObject = null;
    if (HelperService.CheckExistData(objUpdate) &&
        HelperService.CheckExistData(objUpdate.data) &&
        !_.isEmpty(objUpdate.data) &&
        _.isArray(objUpdate.data)) {
        sequelize.Promise.each(objUpdate.data, function(valueConsultNote, indexConsultNote) {
                if (HelperService.CheckExistData(valueConsultNote) &&
                    HelperService.CheckExistData(valueConsultNote.UID)) {
                    return Consultation.update({
                            ModifiedBy: objUpdate.userInfo.ID
                        }, {
                            where: {
                                UID: valueConsultNote.UID
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
                                        consultNoteObject = valueConsultObj;
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
                            if (HelperService.CheckExistData(valueConsultNote) &&
                                HelperService.CheckExistData(valueConsultNote.ConsultationData) &&
                                !_.isEmpty(valueConsultNote.ConsultationData)) {
                                var objectCreateConsultationData = {
                                    data: valueConsultNote.ConsultationData,
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
                                    consultNoteObject: consultNoteObject
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
