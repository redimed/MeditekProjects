module.exports = function(billingUID) {
    var $q = require('q');
    var defer = $q.defer();
    if (billingUID) {
        //get billing

    } else {
        var error = new Error('Readbilling.billingUID.isEmpty');
        defer.reject({ error: error });
    }
    return defer.promise;
};
