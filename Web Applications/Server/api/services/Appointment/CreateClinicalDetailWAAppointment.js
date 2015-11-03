module.exports = function(objCreate) {
    return sequelize.Promise.each(objCreate.data, function(clinicalDetail, index) {
        return objCreate.telehealthAppointmentObject.createClinicalDetail(clinicalDetail, {
                transaction: objCreate.transaction
            })
            .then(function(clinicalDetailCreated) {
                if (HelperService.CheckExistData(clinicalDetail) &&
                    HelperService.CheckExistData(clinicalDetail.FileUploads) &&
                    _.isArray(clinicalDetail.FileUploads)) {
                    var arrayFileUploadsUnique = _.map(_.groupBy(clinicalDetail.FileUploads, function(FU) {
                        return FU.UID;
                    }), function(subGrouped) {
                        return subGrouped[0].UID;
                    });
                    var objectRelClinicalDetailFileUpload = {
                        where: arrayFileUploadsUnique,
                        transaction: objCreate.transaction,
                        clinicalDetailObject: clinicalDetailCreated
                    };
                    return Services.RelClinicalDetailFileUpload(objectRelClinicalDetailFileUpload);
                }
            });
    });
};
