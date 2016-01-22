module.exports = function() {
    var $q = require('q');
    var defer = $q.defer();
    Site.findAll({
            attributes: ['UID', 'SiteName', 'Address', 'PhoneNumber',
                'FaxNumber', 'Email', 'Location', 'Description'
            ],
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
