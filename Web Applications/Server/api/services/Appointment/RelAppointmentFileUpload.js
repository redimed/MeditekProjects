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
                HelperService.CheckExistData(objRel.appointmentObject) &&
                _.isArray(arrIDFileUpload)) {
                return objRel.appointmentObject.setFileUploads(arrIDFileUpload, {
                    transaction: objRel.transaction
                });
            }
        }, function(err) {
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        })
        .then(function(relFileUploadAppointmentCreated) {
            defer.resolve(relFileUploadAppointmentCreated);
        }, function(err) {
            defer.reject({
                transaction: objRel.transaction,
                error: err
            });
        })
    return defer.promise;
};
