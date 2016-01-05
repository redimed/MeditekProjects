    var $q = require('q');
    module.exports = function(objCreate) {
        var defer = $q.defer();
        if (HelperService.CheckExistData(objCreate) &&
            HelperService.CheckExistData(objCreate.data) &&
            !_.isEmpty(objCreate.data)) {
            var arrPatientAdmissionDataCreated = [];
            sequelize.Promise.each(objCreate.data, function(patientAdmissionData, index) {
                    if (HelperService.CheckExistData(patientAdmissionData)) {
                        return AdmissionData.create(patientAdmissionData, {
                                transaction: objCreate.transaction
                            })
                            .then(function(patientAdmissionDataCreated) {
                                arrPatientAdmissionDataCreated.push(patientAdmissionDataCreated);
                                if (HelperService.CheckExistData(patientAdmissionDataCreated) &&
                                    HelperService.CheckExistData(patientAdmissionData.FileUploads) &&
                                    !_.isEmpty(patientAdmissionData.FileUploads)) {
                                    var FileUploads = patientAdmissionData.FileUploads;
                                    var objCreatePatientAdmissionData = {
                                        data: FileUploads,
                                        transaction: objCreate.transaction,
                                        patientAdmissionDataObject: patientAdmissionDataCreated
                                    };
                                    return Services.RelPatientAdmissionDataFileUpload(objCreatePatientAdmissionData);
                                }
                            }, function(err) {
                                defer.reject(err);
                            });
                    }
                })
                .then(function(created) {
                    defer.resolve(arrPatientAdmissionDataCreated);
                }, function(err) {
                    defer.reject(err);
                });
        } else {
            defer.reject('objCreate.BulkCreatePatientAdmissionData.failed');
        }
        return defer.promise;
    };
