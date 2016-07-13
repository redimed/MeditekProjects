var $q = require('q');
var dmUtils = require('../../resDM/dmUtils');
dmLog = dmUtils.dmLog;
module.exports = function(req, res) {
    dmLog("NullPayLoad");
    var q = $q.defer();
    setTimeout(function(){
        q.resolve({
            data: null
        });
    },1);
    
    return q.promise;
}
