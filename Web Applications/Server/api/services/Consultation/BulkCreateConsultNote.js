var $q = require('q');
module.exports = function(objCreate) {
    var defer = $q.defer();
    var userID = null;
    var consultNoteObject = null;
    if (HelperService.CheckExistData(objCreate) &&
        HelperService.CheckExistData(objCreate.data)) {
        sequelize.Promise.each(objCreate.data, function(consultNote, index) {
                userID = consultNote.CreatedBy;
                return Consultation.create(consultNote, {
                        transaction: objCreate.transaction
                    })
                    .then(function(consultNoteCreated) {
                        if (HelperService.CheckExistData(consultNote.ConsultationData) &&
                            !_.isEmpty(consultNote.ConsultationData)) {
                            consultNoteObject = consultNoteCreated;
                            var consultData =
                                Services.GetDataConsultation.ConsultationData(consultNote.ConsultationData, userID);
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
                                consultNoteObject: consultNoteObject
                            };
                            return Services.RelConsultationData(objRelConsultData);
                        }
                    }, function(err) {
                        defer.reject(err);
                    });
            })
            .then(function(consultNotesCreated) {
                defer.resolve(consultNotesCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objCreate.data.ConsultNote.failed');
    }
    return defer.promise;
};
