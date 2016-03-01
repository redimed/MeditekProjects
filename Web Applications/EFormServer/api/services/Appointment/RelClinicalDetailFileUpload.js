var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    FileUpload.findAll({
            attributes: ['ID'],
            where: {
                UID: {
                    $in: objRel.where
                }
            },
            transaction: objRel.transaction
        })
        .then(function(arrIDFileUpload) {
            if (HelperService.CheckExistData(arrIDFileUpload) &&
                HelperService.CheckExistData(objRel.clinicalDetailObject) &&
                _.isArray(arrIDFileUpload)) {
                return objRel.clinicalDetailObject.addFileUploads(arrIDFileUpload, {
                    transaction: objRel.transaction
                });
            }
        }, function(err) {
            defer.reject(err);
        })
        .then(function(relClinicalDetailFileUploadCreated) {
            defer.resolve(relClinicalDetailFileUploadCreated);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
