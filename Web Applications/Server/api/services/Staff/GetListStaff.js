module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, UserAccount);
    UserAccount.findAndCountAll({
            attributes: {
                exclude: ['ID', 'CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy']
            },
            include: [{
                attributes: {
                    exclude: ['ID', 'CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy']
                },
                model: Doctor,
                where: pagination.Doctor,
                required: !_.isEmpty(pagination.Doctor)
            }, {
                attributes: {
                    exclude: ['ID', 'CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy']
                },
                model: Role,
                where: pagination.Role,
                required: !_.isEmpty(pagination.Role)
            }],
            limit: pagination.limit,
            offset: pagination.offset,
            order: pagination.order,
            where: pagination.UserAccount,
            subQuery: false
        })
        .then(function(listStaff) {
            defer.resolve({ data: listStaff });
        }, function(err) {
            defer.reject({
                error: err
            });
        });
    return defer.promise;
};
