module.exports = function(rosterUID) {
    var $q = require('q');
    var defer = $q.defer();
    Roster.findOne({
            attributes: Services.AttributesRoster.Roster(),
            include: [{
                attributes: Services.AttributesRoster.Service(),
                model: Service,
                required: true
            }, {
                attributes: Services.AttributesRoster.Site(),
                model: Site,
                required: true
            }],
            where: {
                UID: rosterUID,
                Enable: 'Y'
            }
        })
        .then(function(rosterRes) {
            defer.resolve({
                data: rosterRes
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
