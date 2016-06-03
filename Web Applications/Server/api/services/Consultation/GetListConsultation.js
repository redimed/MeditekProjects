module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
        var pagination = PaginationService(data, Consultation);
    //add roles
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isPatient &&
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
    }
    Appointment.findAll({
            attributes: ['ID'],
            include: [{
                attributes: ['ID'],
                model: Doctor,
                required: true
            }],
            where: {
                $or: [{
                        CreatedBy: userInfo.ID
                    },
                    sequelize.where(sequelize.col('Doctors.UserAccountID'), userInfo.ID)
                ]
            }
        })
        .then(function(appointmentRoleList) {
            appointmentRoleList = _.map(appointmentRoleList, 'ID');
            if ((role.isInternalPractitioner || role.isExternalPractitioner) &&
                !role.isAdmin &&
                !role.isAssistant) {
                if (!HelperService.CheckExistData(pagination.Appointment)) {
                    pagination.Appointment = [];
                }
                pagination.Appointment.push({
                    ID: {
                        $in: appointmentRoleList
                    }
                });
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
                offset: pagination.offset
            });
        })
        .then(function(consultList) {
            defer.resolve({ data: consultList });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
