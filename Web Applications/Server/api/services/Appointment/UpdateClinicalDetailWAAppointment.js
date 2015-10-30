var $q = require('q');
module.exports = function(objUpdate) {
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
                }
            });
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        })
        .then(function(relClinicalDetailFileUploadDeleted) {
            return TelehealthAppointment.findOne({
                attributes: ['ID'],
                where: {
                    ID: objUpdate.where
                }
            });
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
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
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        })
        .then(function(clinicalDetailCreated) {
            defer.resolve({
                transaction: objUpdate.transaction,
                status: 'success'
            });
        }, function(err) {
            defer.reject({
                transaction: objUpdate.transaction,
                error: err
            });
        });
    return defer.promise;
};
