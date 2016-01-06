var $q = require('q');
module.exports = function(objCreate) {
    var defer = $q.defer();
    var userID = null;
    var consultationObject = null;
    var arrConsultationCreated = [];
    if (HelperService.CheckExistData(objCreate) &&
        HelperService.CheckExistData(objCreate.data)) {
        sequelize.Promise.each(objCreate.data, function(consultation, index) {
                userID = consultation.CreatedBy;
                return Consultation.create(consultation, {
                        transaction: objCreate.transaction
                    })
                    .then(function(consultationCreated) {
                        arrConsultationCreated.push(consultationCreated);
                        if (HelperService.CheckExistData(consultation.ConsultationData) &&
                            !_.isEmpty(consultation.ConsultationData)) {
                            consultationObject = consultationCreated;
                            var consultData =
                                Services.GetDataConsultation.ConsultationData(consultation.ConsultationData, userID);
                            var objectCreateConsultationData = {
                                data: consultData,
                                transaction: objCreate.transaction
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
                                transaction: objCreate.transaction,
                                consultationObject: consultationObject
                            };
                            return Services.RelConsultationData(objRelConsultData);
                        }
                    }, function(err) {
                        defer.reject(err);
                    });
            })
            .then(function(consultationsCreated) {
                defer.resolve(arrConsultationCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objCreate.data.Consultation.failed');
    }
    return defer.promise;
};
