module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, UserAccount);
    UserAccount.findAndCountAll({
            attributes: ['UserName'],
            include: [{
                attributes: ['FirstName', 'MiddleName', 'LastName'],
                model: Patient,
                where: pagination.Patient,
                required: true
            }, {
                attributes: ['UID'],
                model: TelehealthUser,
                where: pagination.TelehealthUser,
                required: true
            }],
            where: pagination.UserAccount,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            subQuery: false
        })
        .then(function(userList) {
            defer.resolve({
                data: userList
            });
        }, function(err) {
            defer.reject({ error: err });
        });
    return defer.promise;
};
