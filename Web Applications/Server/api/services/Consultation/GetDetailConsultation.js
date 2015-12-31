module.exports = function(appointmentUID, userInfo) {
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
    return Appointment.findOne({
        attributes: Services.AttributesAppt.Appointment(),
        include: [{
            attributes: Services.AttributesConsult.Consultation(),
            model: Consultation,
            required: true,
            include: [{
                attributes: Services.AttributesConsult.ConsultationData(),
                model: ConsultationData,
                required: true,
                include: [{
                    attributes: Services.AttributesAppt.FileUpload(),
                    model: FileUpload,
                    required: false
                }]
            }]
        }, {
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
        }],
        where: filter.Appointment
    });
};
