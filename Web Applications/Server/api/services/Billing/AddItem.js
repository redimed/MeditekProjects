module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    console.log('services AddItem', data);
    defer.resolve({data: data})
    return defer.promise;
};
