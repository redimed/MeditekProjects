/*
GetListTelehealthAppointment: get list Telehealth Appointment
input: information filter Telehealth Appointment
output: -success: list appointment with condition received
        -failed: error message
*/
module.exports = function(data, userInfo, objRequired) {
    var $q = require('q');
    var defer = $q.defer();
    //get pagination  with condition received
    var pagination = PaginationService(data, Appointment);
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
    } else if (!role.isAdmin &&
        !role.isAssistant) {
        pagination.limit = 0;
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
            return Appointment.findAndCountAll({
                attributes: Services.AttributesAppt.Appointment(),
                include: [{
                    model: TelehealthAppointment,
                    attributes: Services.AttributesAppt.TelehealthAppointment(),
                    required: !_.isEmpty(pagination.TelehealthAppointment),
                    include: [{
                        model: PatientAppointment,
                        attributes: Services.AttributesAppt.PatientAppointment(),
                        required: !_.isEmpty(pagination.PatientAppointment),
                        where: pagination.PatientAppointment
                    }],
                    where: pagination.TelehealthAppointment
                }, {
                    model: Doctor,
                    attributes: Services.AttributesAppt.Doctor(),
                    required: !_.isEmpty(pagination.Doctor),
                    where: pagination.Doctor
                }, {
                    model: Patient,
                    attributes: Services.AttributesAppt.Patient(),
                    required: !_.isEmpty(pagination.Patient) ||
                        (!_.isEmpty(objRequired) ? objRequired.Patient : false),
                    where: pagination.Patient,
                    include: [{
                        model: UserAccount,
                        attributes: Services.AttributesAppt.UserAccount(),
                        required: false
                    },{
                        model: Company,
                        exclude: ['CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy'],
                        where: pagination.Company,
                        through: {
                            where: {
                                Active: 'Y'
                            }
                        },
                        required: !_.isEmpty(pagination.Company)
                    }]
                }],
                where: pagination.Appointment,
                order: pagination.order,
                limit: pagination.limit,
                offset: pagination.offset,
                subQuery: false
            });
        }, function(err) {
            defer.reject(err);
        })
        .then(function(apptTelehealth) {
            defer.resolve({
                data: apptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
