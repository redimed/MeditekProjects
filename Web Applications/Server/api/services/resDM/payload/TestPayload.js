/**
 * Created by tannguyen on 5/20/16.
 */
var $q = require('q');
module.exports = function (req, res) {
    var q = $q.defer();
    setTimeout(function() {
        q.resolve({name:'tan', address:'binh duong'});
    }, 1000);
    return q.promise;
}
