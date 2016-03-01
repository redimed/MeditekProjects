/*
GetDetailTelehealthAppointmentforEform - services: Get information details for Telehealth Appointment
input: UID Appointment
output: - success: information details Telehealth Appointment
        -failed: [transaction] get details Telehealth Appointment, error message
 */
module.exports = function(appointmentUID) {
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
                }]
            }, {
                model: FileUpload,
                required: false,
                where: {
                    Enable: 'Y'
                }
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
