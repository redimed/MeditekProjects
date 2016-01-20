module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Roster);
    Roster.findAndCountAll({
            attributes: Services.AttributesRoster.Roster(),
            include: [{
                attributes: Services.AttributesRoster.UserAccount(),
                model: UserAccount,
                required: true,
                where: pagination.UserAccount
            }, {
                attributes: Services.AttributesRoster.Service(),
                model: Service,
                required: true
            }],
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            where: pagination.Roster,
            subQuery: false
        })
        .then(function(listRosterRes) {
            defer.resolve({
                data: listRosterRes
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
