module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Appointment);
    Appointment.findAndCountAll({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                attributes: Services.AttributesAppt.Doctor(),
                model: Doctor,
                required: true,
                where: pagination.Doctor
            }],
            where: pagination.Appointment,
            subQuery: false
        })
        .then(function(arrApptRes) {
            defer.resolve({
                data: arrApptRes
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
