module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Appointment) &&
        HelperService.CheckExistData(data.Appointment.UID) &&
        HelperService.CheckExistData(data.Appointment.Status)) {
        Appointment.update({
                Status: data.Appointment.Status
            }, {
                where: {
                    UID: data.Appointment.UID
                },
                individualHooks: true
            })
            .then(function(success) {
                if (!_.isEmpty(success) &&
                    success[0] !== 0) {
                    defer.resolve({
                        status: 'success'
                    });
                } else {
                    var error = new Error('UpdateStatusBooking.Appointment.UID.not.exist');
                    defer.reject({
                        error: error
                    });
                }
            }, function(err) {
                defer.reject({
                    error: err
                });
            });
    } else {
        var error = new Error('UpdateStatusBooking.data.Appointment(UID,Status).not.exist');
        defer.reject({
            error: error
        });
    }
    return defer.promise;
};
