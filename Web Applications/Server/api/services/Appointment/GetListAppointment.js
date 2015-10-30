/*
GetListTelehealthAppointment: get list Telehealth Appointment
input: information filter Telehealth Appointment
output: -success: list appointment with condition received
        -failed: error message
*/
module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    //get pagination  with condition received
    var pagination = Services.GetPaginationAppointment(data, userInfo);
    Appointment.findAndCountAll({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                model: TelehealthAppointment,
                attributes: Services.AttributesAppt.TelehealthAppointment(),
                required: (HelperService.CheckExistData(pagination.filterTelehealthAppointment) && !_.isEmpty(pagination.filterTelehealthAppointment)),
                include: [{
                    model: PatientAppointment,
                    attributes: Services.AttributesAppt.PatientAppointment(),
                    required: (HelperService.CheckExistData(pagination.filterPatientAppointment) && !_.isEmpty(pagination.filterPatientAppointment)),
                    where: pagination.filterPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment
            }, {
                model: Doctor,
                attributes: Services.AttributesAppt.Doctor(),
                required: (HelperService.CheckExistData(pagination.filterDoctor) && !_.isEmpty(pagination.filterDoctor)),
                where: pagination.filterDoctor
            }, {
                model: Patient,
                attributes: Services.AttributesAppt.Patient(),
                required: (HelperService.CheckExistData(pagination.filterPatient) && !_.isEmpty(pagination.filterPatient)),
                where: pagination.filterPatient,
                include: [{
                    model: UserAccount,
                    attributes: Services.AttributesAppt.UserAccount(),
                    required: false
                }]
            }],
            where: pagination.filterAppointment,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            subQuery: false
        })
        .then(function(apptTelehealth) {
            defer.resolve({
                data: apptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
