    var $q = require('q');
    module.exports = function(objCreate) {
        var defer = $q.defer();
        if (HelperService.CheckExistData(objCreate) &&
            HelperService.CheckExistData(objCreate.data) &&
            !_.isEmpty(objCreate.data)) {
            var arrConsultationDataCreated = [];
            sequelize.Promise.each(objCreate.data, function(consultation, index) {
                    if (HelperService.CheckExistData(consultation) &&
                        HelperService.CheckExistData(consultation.ConsultationData) &&
                        HelperService.CheckExistData(consultation.ConsultationData[0])) {
                        return ConsultationData.create(consultation.ConsultationData[0], {
                                trasaction: objCreate.trasaction
                            })
                            .then(function(consultationDataCreated) {
                                arrConsultationDataCreated.push(consultationDataCreated);
                                if (HelperService.CheckExistData(consultationDataCreated) &&
                                    HelperService.CheckExistData(consultation.ConsultationData[0].FileUploads) &&
                                    !_.isEmpty(consultation.ConsultationData[0].FileUploads)) {
                                    var FileUploads = consultation.ConsultationData[0].FileUploads;
                                    var objCreateConsultationData = {
                                        data: FileUploads,
                                        trasaction: objCreate.trasaction,
                                        consultationDataObject: consultationDataCreated
                                    };
                                    return Services.RelConsultationDataFileUpload(objCreateConsultationData);
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
