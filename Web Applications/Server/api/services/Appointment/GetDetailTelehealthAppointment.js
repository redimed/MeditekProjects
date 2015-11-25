/*
GetDetailTelehealthAppointment - services: Get information details for Telehealth Appointment
input: UID Appointment
output: - success: information details Telehealth Appointment
        -failed: [transaction] get details Telehealth Appointment, error message
 */
module.exports = function(appointmentUID, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    //add roles
    var filter = {
        InternalPractitioner: [],
        Appointment: [{
            '$and': {
                UID: appointmentUID
            }
        }],
        UserAccount: []
    };
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isInternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                ID: userInfo.ID
            }
        };
        filter.InternalPractitioner.push(filterRoleTemp);
    } else if (role.isExternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                CreatedBy: userInfo.ID
            }
        };
        filter.Appointment.push(filterRoleTemp);
    } else if (role.isPatient) {
        filter.UserAccount.push({
            '$and': {
                UID: userInfo.UID
            }
        });
    } else if (!role.isAdmin &&
        !role.isAssistant &&
        !role.isPatient) {
        var filterRoleTemp = {
            '$and': {
                UID: null
            }
        };
        filter.Appointment.push(filterRoleTemp);
    }
    Appointment.findOne({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                model: TelehealthAppointment,
                attributes: Services.AttributesAppt.TelehealthAppointment(),
                required: false,
                include: [{
                    model: PatientAppointment,
                    attributes: Services.AttributesAppt.PatientAppointment(),
                    required: false,
                }, {
                    model: ExaminationRequired,
                    attributes: Services.AttributesAppt.ExaminationRequired(),
                    required: false
                }, {
                    model: PreferredPractitioner,
                    attributes: Services.AttributesAppt.PreferredPractitioner(),
                    required: false
                }, {
                    model: ClinicalDetail,
                    attributes: Services.AttributesAppt.ClinicalDetail(),
                    required: false
                }, {
                    model: Doctor,
                    attributes: Services.AttributesAppt.Doctor(),
                    required: false,
                    include: [{
                        model: Country,
                        required: false,
                        attributes: Services.AttributesAppt.Country()
                    }]
                }]
            }, {
                model: Doctor,
                attributes: Services.AttributesAppt.Doctor(),
                required: (HelperService.CheckExistData(filter.InternalPractitioner) && !_.isEmpty(filter.InternalPractitioner)),
                include: [{
                    model: Department,
                    attributes: Services.AttributesAppt.Department(),
                    required: false
                }],
                where: filter.InternalPractitioner
            }, {
                model: Patient,
                attributes: Services.AttributesAppt.Patient(),
                required: false,
                include: [{
                    model: UserAccount,
                    attributes: Services.AttributesAppt.UserAccount(),
                    required: (HelperService.CheckExistData(filter.UserAccount) && !_.isEmpty(filter.UserAccount)),
                    where: filter.UserAccount
                }]
            }, {
                model: FileUpload,
                attributes: Services.AttributesAppt.FileUpload(),
                required: false,
                include: [{
                    model: MedicalImage,
                    required: false
                }, {
                    model: DocumentFile,
                    required: false
                }]
            }],
            where: filter.Appointment
        })
        .then(function(detailApptTelehealth) {
            defer.resolve({
                data: detailApptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
