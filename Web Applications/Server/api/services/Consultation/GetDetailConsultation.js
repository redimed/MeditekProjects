module.exports = function(consultationUID, userInfo) {
    //add roles
    var filter = {
        InternalPractitioner: [],
        Consultation: [{
            '$and': {
                UID: consultationUID
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
        filter.Consultation.push(filterRoleTemp);
    }
    return Consultation.findOne({
        attributes: Services.AttributesConsult.Consultation(),
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
            attributes: Services.AttributesConsult.ConsultationData(),
            model: ConsultationData,
            required: true,
            include: [{
                attributes: Services.AttributesAppt.FileUpload(),
                model: FileUpload,
                required: false
            }]
        }],
        where: filter.Consultation
    });
};
