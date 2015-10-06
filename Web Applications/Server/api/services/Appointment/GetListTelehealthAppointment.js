module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = Services.GetPaginationAppointment(data);
    //get limit, offset
    Appointment.findAll({
            include: [{
                model: TelehealthAppointment,
                required: true,
                include: [{
                    model: PatientAppointment,
                    required: true,
                    where: pagination.filterPatientAppointment,
                    order: pagination.orderPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment,
                order: pagination.orderTelehealthAppointment
            }, {
                model: Doctor,
                required: true,
                where: pagination.filterDoctor,
                order: pagination.orderDoctor
            }],
            where: pagination.filterAppointment,
            order: pagination.orderAppointment,
            limit: pagination.limit,
            offset: pagination.offset,
        })
        .then(function(apptTelehealth) {
            defer.resolve({
                result: apptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
