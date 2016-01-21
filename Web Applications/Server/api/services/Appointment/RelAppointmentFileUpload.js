module.exports = function(objRel) {
    var $q = require('q');
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
            defer.reject(err);
        })
        .then(function(relFileUploadAppointmentCreated) {
            defer.resolve(relFileUploadAppointmentCreated);
        }, function(err) {
            defer.reject(err);
        })
    return defer.promise;
};
