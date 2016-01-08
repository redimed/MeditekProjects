var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data) &&
        !_.isEmpty(objRel.data)) {
         var whereClause = {};
        _.forEach(objRel.data, function(valueData, indexData) {
            if (HelperService.CheckExistData(valueData) &&
                !_.isObject(valueData) &&
                !_.isArray(valueData)) {
                if (moment(valueData, 'YYYY-MM-DD Z', true).isValid() ||
                    moment(valueData, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                    whereClause[indexData] = moment(valueData, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                } else {
                    whereClause[indexData] = valueData;
                }
            }
        });
        FileUpload.findAll({
                attributes: ['ID'],
                where: {
                    $or: whereClause
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
                return objRel.admissionObject.addFileUploads(arrayFileUploadsUnique, {
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
        defer.reject('objRel.RelAdmissionFileUpload.failed');
    }
    return defer.promise;
};
