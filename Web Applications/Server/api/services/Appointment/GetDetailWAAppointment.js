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
    if (role.isInternalPractitioner &&
        !role.isAdmin &&
        !role.isAssistant) {
        var filterRoleTemp = {
            '$and': {
                UserAccountID: userInfo.ID
            }
        };
        filter.InternalPractitioner.push(filterRoleTemp);
    } else if (role.isExternalPractitioner &&
        !role.isAdmin &&
        !role.isAssistant) {
        var filterRoleTemp = {
            '$and': {
                CreatedBy: userInfo.ID
            }
        };
        filter.Appointment.push(filterRoleTemp);
    } else if (role.isPatient &&
        !role.isAdmin &&
        !role.isAssistant) {
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
                        where: {
                            Enable: 'Y'
                        },
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
                    include: [{
                        model: FileUpload,
                        required: false,
                        where: {
                            Enable: 'Y'
                        },
                        attributes: Services.AttributesAppt.FileUpload(),
                    }, {
                        model: Country,
                        required: false,
                        attributes: Services.AttributesAppt.Country()
                    }]
                }]
            }, {
                model: Doctor,
                attributes: Services.AttributesAppt.Doctor(),
                required: !_.isEmpty(filter.InternalPractitioner),
                include: [{
                    model: Department,
                    attributes: Services.AttributesAppt.Department(),
                    required: false
                }, {
                    model: FileUpload,
                    required: false,
                    where: {
                        Enable: 'Y'
                    },
                    attributes: Services.AttributesAppt.FileUpload()
                }],
                where: filter.InternalPractitioner
            }, {
                model: Patient,
                attributes: Services.AttributesAppt.Patient(),
                required: !_.isEmpty(filter.UserAccount),
                include: [{
                    model: UserAccount,
                    include: [{
                        attributes: Services.AttributesAppt.FileUpload(),
                        model: FileUpload,
                        required: false,
                        where: {
                            Enable: 'Y',
                            FileType: 'ProfileImage'
                        }
                    }],
                    attributes: Services.AttributesAppt.UserAccount(),
                    required: !_.isEmpty(filter.UserAccount),
                    where: filter.UserAccount
                }, {
                    attributes: Services.AttributesAppt.PatientDVA(),
                    model: PatientDVA,
                    required: false
                }, {
                    attributes: Services.AttributesAppt.PatientFund(),
                    model: PatientFund,
                    where: {
                        Enable: 'Y'
                    },
                    required: false
                }, {
                    attributes: Services.AttributesAppt.PatientGP(),
                    model: PatientGP,
                    required: false
                }, {
                    attributes: Services.AttributesAppt.PatientKin(),
                    model: PatientKin,
                    required: false
                }, {
                    attributes: Services.AttributesAppt.PatientMedicare(),
                    model: PatientMedicare,
                    required: false
                }, {
                    attributes: Services.AttributesAppt.PatientPension(),
                    model: PatientPension,
                    required: false
                }]
            }, {
                model: FileUpload,
                required: false,
                where: {
                    Enable: 'Y'
                }
            }, {
                attributes: Services.AttributesAppt.OnsiteAppointment(),
                model: OnsiteAppointment,
                required: false
            }, {
                attributes: Services.AttributesAppt.AppointmentData(),
                model: AppointmentData,
                as: 'AppointmentData',
                required: false
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
