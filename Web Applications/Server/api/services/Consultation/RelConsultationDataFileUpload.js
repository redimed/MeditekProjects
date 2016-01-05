var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data) &&
        !_.isEmpty(objRel.data)) {
        FileUpload.findAll({
                attributes: ['ID'],
                where: {
                    $or: objRel.data
                },
                transaction: objRel.transaction,
                raw: true
            })
            .then(function(fileUploadIDRes) {
                var arrayFileUploadsUnique = _.map(_.groupBy(fileUploadIDRes, function(FU) {
                    return FU.UID;
                }), function(subGrouped) {
                    return subGrouped[0].UID;
                });
                return objRel.consultationDataObject.addFileUploads(arrayFileUploadsUnique, {
                    transaction: objRel.transaction,
                    raw: true
                });
            }, function(err) {
                defer.reject(err);
            })
            .then(function(success) {
                defer.resolve(success);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objRel.RelConsultationDataFileUpload.failed');
    }
    return defer.promise;
};
