var $q = require('q');
module.exports = function(objCreate) {
    var defer = $q.defer();
    var userID = null;
    var patientAdmissionObject = null;
    if (HelperService.CheckExistData(objCreate) &&
        HelperService.CheckExistData(objCreate.data)) {
        sequelize.Promise.each(objCreate.data, function(patientAdmission, index) {
                userID = patientAdmission.CreatedBy;
                return Admision.create(patientAdmission, {
                        transaction: objCreate.transaction
                    })
                    .then(function(patientAdmissionCreated) {
                        if (HelperService.CheckExistData(patientAdmission.PatientAdmissionData) &&
                            !_.isEmpty(patientAdmission.PatientAdmissionData)) {
                            patientAdmissionObject = patientAdmissionCreated;
                            var patientAdmissionData =
                                Services.GetDataConsultation.PatientAdmissionData(patientAdmission.PatientAdmissionData, userID);
                            var objectCreatePatientAdmissionData = {
                                data: patientAdmissionData,
                                transaction: objCreate.transaction
                            };
                            return Services.BulkCreatePatientAdmissionData(objectCreatePatientAdmissionData);
                        }
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(admissionDataCreated) {
                        if (HelperService.CheckExistData(admissionDataCreated) &&
                            !_.isEmpty(admissionDataCreated)) {
                            var patientAdmissionDataCreated =
                                JSON.parse(JSON.stringify(admissionDataCreated));
                            var arrayPatientAdmissionDataUnique = _.map(_.groupBy(patientAdmissionDataCreated, function(PA) {
                                return PA.ID;
                            }), function(subGrouped) {
                                return subGrouped[0].ID;
                            });
                            var objRelAdmissionData = {
                                data: arrayPatientAdmissionDataUnique,
                                transaction: objCreate.transaction,
                                patientAdmissionObject: patientAdmissionObject
                            };
                            return Services.RelAdmissionData(objRelAdmissionData);
                        }
                    }, function(err) {
                        defer.reject(err);
                    });
            })
            .then(function(patientAdmissionCreated) {
                defer.resolve(patientAdmissionCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objCreate.data.BulkCreatePatientAdmission.failed');
    }
    return defer.promise;
};
