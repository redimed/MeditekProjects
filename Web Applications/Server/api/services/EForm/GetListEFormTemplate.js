module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, EFormTemplate);
    EFormTemplate.findAndCountAll({
            attributes: Services.AttributesEForm.EFormTemplate(),
            where: pagination.EFormTemplate,
            subQuery: false,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            raw: true
        })
        .then(function(eformTemplateList) {
            defer.resolve({ data: eformTemplateList });
        }, function(err) {
            defer.reject({
                error: err
            });
        });
    return defer.promise;
};
