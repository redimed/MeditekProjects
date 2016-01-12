var $q = require('q');
var moment = require('moment');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data) &&
        !_.isEmpty(objRel.data)) {
        var whereClause = objRel.data;
        _.forEach(objRel.data, function(valueData, indexData) {
            if (HelperService.CheckExistData(valueData) &&
                _.isObject(valueData)) {
                _.forEach(valueData, function(valueKey, indexKey) {
                    if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                        moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                        whereClause[indexData][indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                    } else if (!_.isArray(valueKey) &&
                        !_.isObject(valueKey)) {
                        whereClause[indexData][indexKey] = valueKey;
                    } else {
                        delete whereClause[indexData][indexKey];
                    }
                });
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
                if (HelperService.CheckExistData(arrayFileUploadsUnique) &&
                    !_.isEmpty(arrayFileUploadsUnique)) {
                    return objRel.admissionDataObject.setFileUploads(arrayFileUploadsUnique, {
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
        var error = new Error('objRel.RelAdmissionDataFileUpload.failed');
        defer.reject(error);
    }
    return defer.promise;
};
