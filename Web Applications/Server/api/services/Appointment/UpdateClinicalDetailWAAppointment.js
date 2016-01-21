module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    ClinicalDetail.findAll({
            attributes: ['ID'],
            where: {
                TelehealthAppointmentID: objUpdate.where
            },
            transaction: objUpdate.transaction,
            raw: true
        })
        .then(function(arrayIDClinicalDetail) {
            var arrayIDClinicalDetail = _.map(_.groupBy(arrayIDClinicalDetail, function(FU) {
                return FU.ID;
            }), function(subGrouped) {
                return subGrouped[0].ID;
            });
            return RelClinicalDetailFileUpload.destroy({
                where: {
                    ClinicalDetailID: {
                        $in: arrayIDClinicalDetail
                    }
                },
                transaction: objUpdate.transaction
            });
        }, function(err) {
            defer.reject(err);
        })
        .then(function(relClinicalDetailFileUploadDeleted) {
            return ClinicalDetail.destroy({
                where: {
                    TelehealthAppointmentID: objUpdate.where
                },
                transaction: objUpdate.transaction,
            });
        }, function(err) {
            defer.reject(err);
        })
        .then(function(clinicalDetailDeleted) {
            return TelehealthAppointment.findOne({
                attributes: ['ID'],
                where: {
                    ID: objUpdate.where
                },
                transaction: objUpdate.transaction
            });
        }, function(err) {
            defer.reject(err);
        })
        .then(function(telehealthAppointmentObject) {
            var dataClinicalDetails = Services.GetDataAppointment.ClinicalDetails(objUpdate.where, objUpdate.createdBy, objUpdate.data);
            var objCreateClinicalDetail = {
                data: dataClinicalDetails,
                transaction: objUpdate.transaction,
                telehealthAppointmentObject: telehealthAppointmentObject
            };
            return Services.CreateClinicalDetailWAAppointment(objCreateClinicalDetail);
        }, function(err) {
            defer.reject(err);
        })
        .then(function(clinicalDetailCreated) {
            defer.resolve(clinicalDetailCreated);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
