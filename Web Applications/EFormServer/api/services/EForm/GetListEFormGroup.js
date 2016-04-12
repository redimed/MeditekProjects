module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, EFormGroup);
    EFormGroup.findAll({
            where: pagination.EFormGroup,
            include: [{
                model: UserAccount,
                required: false
            }],
            limit: pagination.limit,
            offset: pagination.offset,
            order: pagination.order
        })
        .then(function(eformGroupList) {
            defer.resolve({ data: eformGroupList });
        }, function(err) {
            defer.reject({ error: err });
        })
    return defer.promise;
}
