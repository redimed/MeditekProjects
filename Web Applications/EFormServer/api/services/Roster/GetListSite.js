module.exports = function() {
    var $q = require('q');
    var defer = $q.defer();
    Site.findAll({
            attributes: Services.AttributesRoster.Site(),
            where: {
                Enable: 'Y'
            }
        })
        .then(function(listSite) {
            defer.resolve({
                data: listSite
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
