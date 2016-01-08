var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data) &&
        !_.isEmpty(objRel.data)) {
        var whereClause = objRel.data;
        _.forEach(objRel.data, function(valueData, indexData) {
            if (HelperService.CheckExistData(valueData) &&
                !_.isObject(valueData)) {
                _.forEach(valueData, function(valueKey, indexKey) {
                    if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                        moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                        whereClause[indexData][indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                    } else {
                        whereClause[indexData][indexKey] = valueKey;
                    }
                })
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
                    return FU.ID;
                }), function(subGrouped) {
                    return subGrouped[0].ID;
                });
                if (HelperService.CheckExistData(arrayFileUploadsUnique)) {
                    return objRel.consultationObject.setFileUploads(arrayFileUploadsUnique, {
                        transaction: objRel.transaction,
                        raw: true
                    });
                }
            }, function(err) {
                defer.reject(err);
            })
            .then(function(success) {
                defer.resolve(success);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('objRel.RelConsultationFileUpload.failed');
    }
    return defer.promise;
};
