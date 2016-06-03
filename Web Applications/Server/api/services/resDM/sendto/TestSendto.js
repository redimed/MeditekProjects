/**
 * Created by tannguyen on 5/20/16.
 */
var $q = require('q');
module.exports = function (req, res) {
    var q = $q.defer();
    setTimeout(function() {
        q.resolve(['tan', 'trinh', 'ngoc', 'ngan']);
    }, 1000)
    return q.promise;
}