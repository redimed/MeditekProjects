module.exports = function(data, userInfo) {
    var pagination = PaginationService(data, Consultation);
    //add roles
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isInternalPractitioner &&
        !role.isAdmin &&
        !role.isAssistant) {
        var filterRoleTemp = {
            '$and': {
                UserAccountID: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(pagination.Doctor)) {
            pagination.Doctor = [];
        }
        pagination.Doctor.push(filterRoleTemp);
    } else if (role.isExternalPractitioner &&
        !role.isAdmin &&
        !role.isAssistant) {
        var filterRoleTemp = {
            '$and': {
                CreatedBy: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(pagination.Appointment)) {
            pagination.Appointment = [];
        }
        pagination.Appointment.push(filterRoleTemp);
    } else if (role.isPatient &&
        !role.isAdmin &&
        !role.isAssistant) {
        var filterRoleTemp = {
            '$and': {
                UserAccountID: userInfo.ID
            }
        };
        if (!HelperService.CheckExistData(pagination.Patient)) {
            pagination.Patient = [];
        }
        pagination.Patient.push(filterRoleTemp);
    } else if (!role.isAdmin &&
        !role.isAssistant) {
        pagination.limit = 0;
    }
    return Consultation.findAndCountAll({
        attributes: Services.AttributesConsult.Consultation(),
        include: [{
            attributes: ['UID'],
            model: Appointment,
            required: !_.isEmpty(pagination.Appointment),
            where: pagination.Appointment,
            include: [{
                attributes: Services.AttributesAppt.Doctor(),
                required: !_.isEmpty(pagination.Doctor),
                model: Doctor,
                where: pagination.Doctor
            }, {
                attributes: ['UID'],
                required: !_.isEmpty(pagination.Patient),
                model: Patient,
                where: pagination.Patient
            }]
        }],
        order: pagination.order,
        limit: pagination.limit,
        offset: pagination.offset,
        subQuery: false
    });
};
