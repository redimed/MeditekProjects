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
    var pagination = PaginationService(data, Appointment);
    //add roles
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isInternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                UserAccountID: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(pagination.Doctor)) {
            pagination.Doctor = [];
        }
        pagination.Doctor.push(filterRoleTemp);
    } else if (role.isExternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                CreatedBy: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(pagination.Appointment)) {
            pagination.Appointment = [];
        }
        pagination.Appointment.push(filterRoleTemp);
    } else if (role.isPatient) {
        var filterRoleTemp = {
            '$and': {
                UserAccountID: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(pagination.Patient)) {
            pagination.Patient = [];
        }
        pagination.Patient.push(filterRoleTemp);
    } else if (!role.isAdmin &&
        !role.isAssistant) {
        pagination.limit = 0;
    }
    Appointment.findAndCountAll({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                model: TelehealthAppointment,
                attributes: Services.AttributesAppt.TelehealthAppointment(),
                required: !_.isEmpty(pagination.TelehealthAppointment),
                include: [{
                    model: PatientAppointment,
                    attributes: Services.AttributesAppt.PatientAppointment(),
                    required: !_.isEmpty(pagination.PatientAppointment),
                    where: pagination.PatientAppointment
                }],
                where: pagination.TelehealthAppointment
            }, {
                model: Doctor,
                attributes: Services.AttributesAppt.Doctor(),
                required: !_.isEmpty(pagination.Doctor),
                where: pagination.Doctor
            }, {
                model: Patient,
                attributes: Services.AttributesAppt.Patient(),
                required: !_.isEmpty(pagination.Patient) ||
                    (!_.isEmpty(objRequired) ? objRequired.Patient : false),
                where: pagination.Patient,
                include: [{
                    model: UserAccount,
                    attributes: Services.AttributesAppt.UserAccount(),
                    required: false
                }]
            }],
            where: pagination.Appointment,
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