module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isAdmin ||
        role.isAssistant) {
        //get list appointment for admin
        Services.GetListRosterAdmin(data, userInfo)
            .then(function(apptList) {
                defer.resolve({ data: apptList });
            }, function(err) {
                defer.reject(err);
            });
    } else {
        //get list appointment for staff
        Services.GetListRosterStaff(data, userInfo)
            .then(function(apptList) {
                defer.resolve({ data: apptList });
            }, function(err) {
                defer.reject(err);
            });
    }
    return defer.promise;
};
