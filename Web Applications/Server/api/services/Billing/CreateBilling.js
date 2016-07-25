module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(data)) {
        sequelize.transaction()
            .then(function(t) {
            	//create billing
            	
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        var error = new Error('CreateBilling.data.isEmpty');
        defer.reject({ error: error });
    }
    return defer.promise;
};
