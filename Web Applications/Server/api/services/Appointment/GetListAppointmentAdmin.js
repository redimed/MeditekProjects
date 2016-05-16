module.exports = function(data, userInfo, objRequired) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Appointment);
    Appointment.findAndCountAll({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                model: TelehealthAppointment,
                attributes: Services.AttributesAppt.TelehealthAppointment(),
                required: !_.isEmpty(pagination.TelehealthAppointment),
                where: pagination.TelehealthAppointment
            }, {
                model: Doctor,
                attributes: Services.AttributesAppt.Doctor(),
                required: !_.isEmpty(pagination.Doctor),
                where: pagination.Doctor
            }, {
                model: Patient,
                attributes: Services.AttributesAppt.Patient(),
                required: ((!_.isEmpty(objRequired)) ? objRequired.Patient : false || !_.isEmpty(pagination.Patient)),
                where: pagination.Patient,
                include: [{
                    model: UserAccount,
                    attributes: Services.AttributesAppt.UserAccount(),
                    required: false
                }, {
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
            }, {
                model: PatientAppointment,
                attributes: Services.AttributesAppt.PatientAppointment(),
                required: !_.isEmpty(pagination.PatientAppointment),
                where: pagination.PatientAppointment
            }],
            where: pagination.Appointment,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            subQuery: false
        })
        .then(function(apptList) {
            defer.resolve(apptList);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
