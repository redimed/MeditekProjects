/*
GetListTelehealthAppointment: get list Telehealth Appointment
input: information filter Telehealth Appointment
output: -success: list appointment with condition received
        -failed: error message
*/
module.exports = function(data, userInfo, objRequired) {
    var $q = require('q');
    var defer = $q.defer();
    //get pagination  with condition received
    // var pagination = PaginationService(data, Appointment);
    //add roles
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isAdmin ||
        role.isAssistant) {
        //get list appointment for admin
        Services.GetListAppointmentAdmin(data, userInfo, objRequired)
            .then(function(apptList) {
                defer.resolve({ data: apptList });
            }, function(err) {
                defer.reject(err);
            });
    } else if (role.isInternalPractitioner ||
        role.isExternalPractitioner) {
        //get list appointment for Doctor
        Services.GetListAppointmentDoctor(data, userInfo, objRequired)
            .then(function(apptList) {
                defer.resolve({ data: apptList });
            }, function(err) {
                defer.reject(err);
            });
    } else if (role.isOrganization) {
        //get list appointment for Organization
        Services.GetListAppointmentOrganization(data, userInfo, objRequired)
            .then(function(apptList) {
                defer.resolve({ data: apptList });
            }, function(err) {
                defer.reject(err);
            });
    } else if (role.isPatient) {
        Services.GetListAppointmentPatient(data, userInfo, objRequired)
            .then(function(apptList) {
                defer.resolve({ data: apptList });
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('GetListAppointment.not.permission');
        defer.reject(error);
    }
    return defer.promise;
};
