var $q = require('q');
module.exports = function(objCreate) {
    var defer = $q.defer();
    var userID = null;
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
                    });
            })
            .then(function(consultNotesCreated) {
                console.log('consultNotesCreated', consultNotesCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objCreate.data.ConsultNote.failed');
    }
    return defer.promise;
};
