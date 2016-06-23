/**
 * Created by tannguyen on 23/06/2016.
 */
var $q = require('q');
module.exports = function (req, res) {
    var q = $q.defer();
    setTimeout(function() {
        q.resolve(['nc']);
    }, 1000)
    return q.promise;
}