module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Roster);
    var filterRoleTemp = {
        '$and': {
            ID: userInfo.ID
        }
    };
    if (!HelperService.CheckExistData(pagination.UserAccount)) {
        pagination.UserAccount = [];
    }
    pagination.UserAccount.push(filterRoleTemp);
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
                required: true,
                where: pagination.Site
            }],
            limit: pagination.limit,
            offset: pagination.offset,
            where: pagination.Roster,
            order: pagination.order
        })
        .then(function(listRosterRes) {
            defer.resolve(listRosterRes);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
