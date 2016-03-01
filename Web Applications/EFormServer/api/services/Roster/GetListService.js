module.exports = function() {
    var $q = require('q');
    var defer = $q.defer();
    Service.findAll({
            attributes: Services.AttributesRoster.Service(),
            where: {
            	Enable: 'Y'
            }
        })
        .then(function(listService) {
            defer.resolve({
                data: listService
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
