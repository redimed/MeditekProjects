    var $q = require('q');
    module.exports = function(objCreate) {
        var defer = $q.defer();
        if (HelperService.CheckExistData(objCreate) &&
            HelperService.CheckExistData(objCreate.data) &&
            !_.isEmpty(objCreate.data)) {
            var arrAdmissionDataCreated = [];
            sequelize.Promise.each(objCreate.data, function(admissionData, index) {
                    if (HelperService.CheckExistData(admissionData)) {
                        return AdmissionData.create(admissionData, {
                                transaction: objCreate.transaction
                            })
                            .then(function(admissionDataCreated) {
                                arrAdmissionDataCreated.push(admissionDataCreated);
                                if (HelperService.CheckExistData(admissionDataCreated) &&
                                    HelperService.CheckExistData(admissionData.FileUploads) &&
                                    !_.isEmpty(admissionData.FileUploads)) {
                                    var FileUploads = admissionData.FileUploads;
                                    var objCreateAdmissionData = {
                                        data: FileUploads,
                                        transaction: objCreate.transaction,
                                        admissionDataObject: admissionDataCreated
                                    };
                                    return Services.RelAdmissionDataFileUpload(objCreateAdmissionData);
                                }
                            }, function(err) {
                                defer.reject(err);
                            });
                    }
                })
                .then(function(created) {
                    defer.resolve(arrAdmissionDataCreated);
                }, function(err) {
                    defer.reject(err);
                });
        } else {
            defer.reject('objCreate.BulkCreateAdmissionData.failed');
        }
        return defer.promise;
    };
