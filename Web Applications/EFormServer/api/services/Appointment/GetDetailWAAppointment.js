/*
GetDetailTelehealthAppointment - services: Get information details for Telehealth Appointment
input: UID Appointment
output: - success: information details Telehealth Appointment
        -failed: [transaction] get details Telehealth Appointment, error message
 */
var o = require("../HelperService");
module.exports = function(appointmentUID, userUID) {
    var $q = require('q');
    var defer = $q.defer();
    //add roles
    var filter = {
        InternalPractitioner: {},
        Appointment: [{
            '$and': {
                UID: appointmentUID
            }
        }],
        UserAccount: [],
        RelUserRole: {RoleId: o.const.rolesID.internalPractitioner}
    };

    UserAccount.findOne({
        attributes: ['ID'],
        where: {UID: userUID}
    })
    .then(function(userLogin){
        if(userLogin) {
            filter.InternalPractitioner.UserAccountID = userLogin.ID
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
                // required: !_.isEmpty(filter.InternalPractitioner),
                required: false,
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
                } , {
                    model: UserAccount,
                    attributes: ['ID'],
                    required:false,
                    include: [
                        {
                            model: RelUserRole,
                            attributes: ['RoleId'],
                            where : o.sqlParam(filter.RelUserRole),
                            required:false
                        }
                    ],
                }],
                where: o.sqlParam(filter.InternalPractitioner),
            }, {
                model: Patient,
                attributes: Services.AttributesAppt.Patient(),
                required: !_.isEmpty(filter.UserAccount),
                include: [{
                    model: UserAccount,
                    /*include: [{
                        attributes: Services.AttributesAppt.FileUpload(),
                        model: FileUpload,
                        required: false,
                        where: {
                            Enable: 'Y',
                            FileType: {$or:["ProfileImage","Signature"]}
                        }
                    }],*/
                    attributes: Services.AttributesAppt.UserAccount(),
                    required: !_.isEmpty(filter.UserAccount),
                    where: o.sqlParam(filter.UserAccount)
                }]
            }, {
                model: FileUpload,
                required: false,
                where: {
                    Enable: 'Y'
                }
            }],
            where: o.sqlParam(filter.Appointment)
        })
        .then(function(detailApptTelehealth) {
            defer.resolve(
                detailApptTelehealth
            );
        }, function(err) {
            defer.reject(err);
        });
    },function(err){
        defer.reject(err);
    })
    return defer.promise;
};
