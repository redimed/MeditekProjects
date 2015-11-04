var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    FileUpload.findAll({
            attributes: ['ID'],
            where: {
                UID: {
                    $in: objRel.where
                }
            }
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
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        })
        .then(function(relClinicalDetailFileUploadCreated) {
            defer.resolve(relClinicalDetailFileUploadCreated);
        }, function(err) {
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        });
    return defer.promise;
};
