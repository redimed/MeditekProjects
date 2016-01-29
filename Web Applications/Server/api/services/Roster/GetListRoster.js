module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Roster);
    Roster.findAndCountAll({
            attributes: Services.AttributesRoster.Roster(),
            include: [{
                attributes: Services.AttributesRoster.UserAccount(),
                include: [{
                    attributes: Services.AttributesAppt.Doctor(),
                    model: Doctor,
                    required: true,
                    where: pagination.Doctor
                }],
                model: UserAccount,
                required: true,
                where: pagination.UserAccount
            }, {
                attributes: Services.AttributesRoster.Service(),
                model: Service,
                required: true
            }, {
                attributes: Services.AttributesRoster.Site(),
                model: Site,
                required: true
            }],
            limit: pagination.limit,
            offset: pagination.offset,
            where: pagination.Roster,
            subQuery: false,
            order: pagination.order
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
