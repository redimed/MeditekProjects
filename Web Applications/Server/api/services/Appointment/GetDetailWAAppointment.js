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
        ExternalPractitioner: [],
        Appointment: [{
            '$and': {
                UID: appointmentUID
            }
        }]
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
        filter.ExternalPractitioner.push(filterRoleTemp);
    } else if (!role.isAdmin &&
        !role.isAssistant) {
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
                    model: WAAppointment,
                    attributes: Services.AttributesAppt.WAAppointment(),
                    required: false
                }, {
                    model: PatientAppointment,
                    attributes: Services.AttributesAppt.PatientAppointment(),
                    required: false,
                }, {
                    model: PreferredPractitioner,
                    attributes: Services.AttributesAppt.PreferredPractitioner(),
                    required: false
                }, {
                    model: ClinicalDetail,
                    attributes: Services.AttributesAppt.ClinicalDetail(),
                    required: false,
                    include: [{
                        model: FileUpload,
                        required: false,
                        include: [{
                            model: MedicalImage,
                            required: false
                        }, {
                            model: DocumentFile,
                            required: false
                        }]
                    }]
                }, {
                    model: Doctor,
                    attributes: Services.AttributesAppt.Doctor(),
                    required: false,
                    where: filter.ExternalPractitioner
                }]
            }, {
                model: Doctor,
                attributes: Services.AttributesAppt.Doctor(),
                required: false,
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
