var $q = require('q');
module.exports = function(data, userInfo) {
    var defer = $q.defer();
    var pagination = Services.GetPaginationAppointment(data, userInfo);
    Appointment.findAndCountAll({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                attributes: Services.AttributesAppt.Patient(),
                model: Patient,
                required: true
            }, {
                attributes: Services.AttributesAppt.Doctor(),
                model: Doctor,
                required: true
            }],
            where: pagination.filterAppointment,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            subQuery: false
        })
        .then(function(consultationList) {
            defer.resolve(consultationList);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
