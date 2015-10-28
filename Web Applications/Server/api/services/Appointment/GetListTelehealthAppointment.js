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
            attributes: Services.AttributesTeleAppt.Appointment(),
            include: [{
                model: TelehealthAppointment,
                attributes: Services.AttributesTeleAppt.TelehealthAppointment(),
                required: (HelperService.CheckExistData(pagination.filterPatientAppointment) && !_.isEmpty(pagination.filterPatientAppointment)),
                include: [{
                    model: PatientAppointment,
                    attributes: Services.AttributesTeleAppt.PatientAppointment(),
                    required: (HelperService.CheckExistData(pagination.filterPatientAppointment) && !_.isEmpty(pagination.filterPatientAppointment)),
                    where: pagination.filterPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment
            }, {
                model: Doctor,
                attributes: Services.AttributesTeleAppt.Doctor(),
                required: (HelperService.CheckExistData(pagination.filterDoctor) && !_.isEmpty(pagination.filterDoctor)),
                where: pagination.filterDoctor
            }, {
                model: Patient,
                attributes: Services.AttributesTeleAppt.Patient(),
                required: (HelperService.CheckExistData(pagination.filterPatient) && !_.isEmpty(pagination.filterPatient)),
                where: pagination.filterPatient,
                include: [{
                    model: UserAccount,
                    attributes: Services.AttributesTeleAppt.UserAccount(),
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
