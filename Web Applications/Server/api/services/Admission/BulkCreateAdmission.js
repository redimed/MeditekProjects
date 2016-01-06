var $q = require('q');
module.exports = function(objCreate) {
    var defer = $q.defer();
    var userID = null;
    var admissionObject = null;
    var arrAdmissionCreated = [];
    if (HelperService.CheckExistData(objCreate) &&
        HelperService.CheckExistData(objCreate.data)) {
        sequelize.Promise.each(objCreate.data, function(admission, index) {
                userID = admission.CreatedBy;
                return Admission.create(admission, {
                        transaction: objCreate.transaction
                    })
                    .then(function(admissionCreated) {
                        arrAdmissionCreated.push(admissionCreated);
                        if (HelperService.CheckExistData(admission.AdmissionData) &&
                            !_.isEmpty(admission.AdmissionData)) {
                            admissionObject = admissionCreated;
                            var admissionData =
                                Services.GetDataAdmission.AdmissionData(admission.AdmissionData, userID);
                            var objectCreateAdmissionData = {
                                data: admissionData,
                                transaction: objCreate.transaction
                            };
                            return Services.BulkCreateAdmissionData(objectCreateAdmissionData);
                        }
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(admissionDataCreated) {
                        if (HelperService.CheckExistData(admissionDataCreated) &&
                            !_.isEmpty(admissionDataCreated)) {
                            var admissionDataCreated =
                                JSON.parse(JSON.stringify(admissionDataCreated));
                            var arrayAdmissionDataUnique = _.map(_.groupBy(admissionDataCreated, function(AD) {
                                return AD.ID;
                            }), function(subGrouped) {
                                return subGrouped[0].ID;
                            });
                            var objRelAdmissionData = {
                                data: arrayAdmissionDataUnique,
                                transaction: objCreate.transaction,
                                admissionObject: admissionObject
                            };
                            return Services.RelAdmissionData(objRelAdmissionData);
                        }
                    }, function(err) {
                        defer.reject(err);
                    });
            })
            .then(function(admissionCreated) {
                defer.resolve(arrAdmissionCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objCreate.data.BulkCreateAdmission.failed');
    }
    return defer.promise;
};
