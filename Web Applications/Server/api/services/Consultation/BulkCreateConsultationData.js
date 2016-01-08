    var $q = require('q');
    module.exports = function(objCreate) {
        var defer = $q.defer();
        if (HelperService.CheckExistData(objCreate) &&
            HelperService.CheckExistData(objCreate.data) &&
            !_.isEmpty(objCreate.data)) {
            var arrConsultationDataCreated = [];
            sequelize.Promise.each(objCreate.data, function(consultation, index) {
                    if (HelperService.CheckExistData(consultation)) {
                        return ConsultationData.create(consultation, {
                                transaction: objCreate.transaction
                            })
                            .then(function(consultationDataCreated) {
                                arrConsultationDataCreated.push(consultationDataCreated);
                                if (HelperService.CheckExistData(consultationDataCreated) &&
                                    HelperService.CheckExistData(consultation.FileUploads) &&
                                    !_.isEmpty(consultation.FileUploads)) {
                                    var FileUploads = consultation.FileUploads;
                                    var objRelConsultationDataFileUpload = {
                                        data: FileUploads,
                                        transaction: objCreate.transaction,
                                        consultationDataObject: consultationDataCreated
                                    };
                                    return Services.RelConsultationDataFileUpload(objRelConsultationDataFileUpload);
                                }
                            }, function(err) {
                                defer.reject(err);
                            });
                    }
                })
                .then(function(created) {
                    defer.resolve(arrConsultationDataCreated);
                }, function(err) {
                    defer.reject(err);
                });
        } else {
            defer.reject('objCreate.BulkCreateConsultationData.failed');
        }
        return defer.promise;
    };
