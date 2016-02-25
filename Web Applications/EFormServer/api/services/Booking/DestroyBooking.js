module.exports = function(UIDAppointment, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    Appointment.update({
            Enable: 'N'
        }, {
            where: {
                UID: UIDAppointment
            }
        })
        .then(function(apptDestroyed) {
            defer.resolve({
                status: 'success'
            });
        }, function(err) {
            defer.reject({
                error: err
            });
        });
    return defer.promise;
};
