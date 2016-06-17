/*
DisableAppointment - services: Deleted a Telehealth Appointment
input: UID Telehealth Appointment
output: -success: transaction deleted Teleheath Appointment
        -failed: [transaction] deleted Telehealth Appointment, error message
*/
module.exports = function(UIDAppointment) {
    var $q = require('q');
    var defer = $q.defer();
    Appointment.update({
            Enable: 'N'
        }, {
            where: {
                UID: UIDAppointment
            },
            individualHooks: true
        })
        .then(function(apptUpdated) {
            if (apptUpdated[0] &&
                apptUpdated[0] > 0) {
                defer.resolve({ status: 'success' });
            } else {
                defer.reject({ status: 'Appointment not found'});
            }
        }, function(err) {
            defer.reject({ error: err });
        });
    return defer.promise;
};
