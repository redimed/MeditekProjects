module.exports = function(billingUID) {
    var $q = require('q');
    var defer = $q.defer();
    if (billingUID) {
        //destroy billing
        BillingItem.update({
                Enable: 'N'
            }, {
                where: {
                    UID: billingUID
                }
            })
            .then(function(billingDisabled) {
                defer.resolve(billingDisabled);
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        var error = new Error('Destroy.billingUID.isEmpty');
        defer.reject({ error: error });
    }
    return defer.promise;
};
