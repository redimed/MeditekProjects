/*
GetDetailTelehealthAppointment - services: Get information details for Telehealth Appointment
input: UID Appointment
output: - success: information details Telehealth Appointment
        -failed: [transaction] get details Telehealth Appointment, error message
 */
module.exports = function(appointmentUID) {
    var $q = require('q');
    var defer = $q.defer();
    Appointment.findOne({
            attributes: Services.AttributesTeleAppt.Appointment(),
            include: [{
                model: TelehealthAppointment,
                attributes: Services.AttributesTeleAppt.TelehealthAppointment(),
                required: false,
                include: [{
                    model: PatientAppointment,
                    attributes: Services.AttributesTeleAppt.PatientAppointment(),
                    required: false,
                }, {
                    model: ExaminationRequired,
                    attributes: Services.AttributesTeleAppt.ExaminationRequired(),
                    required: false
                }, {
                    model: PreferredPractitioner,
                    attributes: Services.AttributesTeleAppt.PreferredPractitioner(),
                    required: false
                }, {
                    model: ClinicalDetail,
                    attributes: Services.AttributesTeleAppt.ClinicalDetail(),
                    required: false
                }, {
                    model: Doctor,
                    attributes: Services.AttributesTeleAppt.Doctor(),
                    required: false
                }]
            }, {
                model: Doctor,
                attributes: Services.AttributesTeleAppt.Doctor(),
                required: false,
                include: [{
                    model: Department,
                    attributes: Services.AttributesTeleAppt.Department(),
                    required: false
                }]
            }, {
                model: Patient,
                attributes: Services.AttributesTeleAppt.Patient(),
                required: false,
                include: [{
                    model: UserAccount,
                    attributes: Services.AttributesTeleAppt.UserAccount(),
                    required: false
                }]
            }, {
                model: FileUpload,
                required: false,
                include: [{
                    model: MedicalImage,
                    required: false
                }, {
                    model: DocumentFile,
                    required: false
                }]
            }],
            where: {
                UID: appointmentUID
            }
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
