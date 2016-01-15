/*
GetListTelehealthAppointment: get list Telehealth Appointment
input: information filter Telehealth Appointment
output: -success: list appointment with condition received
        -failed: error message
*/
module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Appointment);
    //add roles
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isInternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                ID: userInfo.ID
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
    //get limit, offset
    Appointment.findAndCountAll({
            attributes: ['UID', 'FromTime', 'ToTime', 'RequestDate',
                'ApprovalDate', 'Status', 'Enable', 'CreatedDate'
            ],
            include: [{
                model: TelehealthAppointment,
                attributes: ['UID', 'RefName', 'RefDate', 'Correspondence'],
                required: !_.isEmpty(pagination.PatientAppointment),
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'WorkPhoneNumber'],
                    required: !_.isEmpty(pagination.PatientAppointment),
                    where: pagination.PatientAppointment
                }],
                where: pagination.TelehealthAppointment
            }, {
                model: Doctor,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'HomePhoneNumber', 'WorkPhoneNumber'],
                required: !_.isEmpty(pagination.Doctor),
                where: pagination.Doctor
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB'],
                required: !_.isEmpty(pagination.Patient),
                where: pagination.Patient,
                include: [{
                    model: UserAccount,
                    attributes: ['ID', 'UserName', 'Email', 'PhoneNumber', 'Activated'],
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
