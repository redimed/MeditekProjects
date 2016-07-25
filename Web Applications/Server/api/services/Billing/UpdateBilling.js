module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(data)) {
        sequelize.transaction()
            .then(function(t) {
                //update billing

            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        var error = new Error('UpdateBilling.data.isEmpty');
        defer.reject({ error: error });
    }
    return defer.promise;
};
