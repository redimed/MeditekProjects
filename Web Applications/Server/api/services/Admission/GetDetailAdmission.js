var $q = require('q');
module.exports = function(admissionUID, userInfo) {
    var defer = $q.defer();
    //add roles
    var filter = {
        Doctor: [],
        Admission: [{
            '$and': {
                UID: admissionUID
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
                ID: userInfo.ID
            }
        };
        filter.Doctor.push(filterRoleTemp);
    } else if (role.isExternalPractitioner &&
        !role.isAdmin &&
        !role.isAssistant) {
        var filterRoleTemp = {
            '$and': {
                CreatedBy: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(filter.Appointment)) {
            filter.Appointment = [];
        }
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
        filter.Admission.push(filterRoleTemp);
    }
    Admission.findOne({
            attributes: Services.AttributesAdmission.Admission(),
            include: [{
                attributes: Services.AttributesAppt.Appointment(),
                model: Appointment,
                required: false,
                include: [{
                    attributes: ['UID'],
                    required: !_.isEmpty(filter.Doctor),
                    model: Doctor,
                    where: filter.Doctor
                }, {
                    attributes: ['UID'],
                    required: !_.isEmpty(filter.UserAccount),
                    model: Patient,
                    include: [{
                        attributes: ['UID'],
                        model: UserAccount,
                        required: !_.isEmpty(filter.UserAccount),
                        where: filter.UserAccount
                    }]
                }]
            }, {
                attributes: Services.AttributesAdmission.AdmissionData(),
                model: AdmissionData,
                required: false,
                include: [{
                    attributes: Services.AttributesAppt.FileUpload(),
                    model: FileUpload,
                    required: false
                }]
            }, {
                attributes: Services.AttributesAppt.FileUpload(),
                model: FileUpload,
                required: false
            }],
            where: filter.Admission
        })
        .then(function(addmissionRes) {
            defer.resolve({
                data: addmissionRes
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
