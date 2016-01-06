var $q = require('q');
module.exports = function(admissionUID, userInfo) {
    var defer = $q.defer();
    //add roles
    var filter = {
        InternalPractitioner: [],
        Admission: [{
            '$and': {
                UID: admissionUID
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
        filter.Admission.push(filterRoleTemp);
    }
    Admission.findOne({
            attributes: Services.AttributesAdmission.PatientAdmission(),
            include: [{
                attributes: Services.AttributesAppt.Appointment(),
                model: Appointment,
                required: false,
                include: [{
                    attributes: ['UID'],
                    required: (HelperService.CheckExistData(filter.InternalPractitioner) && !_.isEmpty(filter.InternalPractitioner)),
                    model: Doctor,
                    where: filter.InternalPractitioner
                }, {
                    attributes: ['UID'],
                    required: (HelperService.CheckExistData(filter.UserAccount) && !_.isEmpty(filter.UserAccount)),
                    model: Patient,
                    include: [{
                        attributes: ['UID'],
                        model: UserAccount,
                        required: (HelperService.CheckExistData(filter.UserAccount) && !_.isEmpty(filter.UserAccount)),
                        where: filter.UserAccount
                    }]
                }]
            }, {
                attributes: Services.AttributesAdmission.PatientAdmissionData(),
                model: AdmissionData,
                required: true,
                include: [{
                    attributes: Services.AttributesAppt.FileUpload(),
                    model: FileUpload,
                    required: false
                }]
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
