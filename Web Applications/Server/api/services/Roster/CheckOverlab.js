module.exports = function(objCheckOverlab) {
    var $q = require('q');
    var defer = $q.defer();
    defer.resolve({
        overlab: false
    });
    return defer.promise;
};
