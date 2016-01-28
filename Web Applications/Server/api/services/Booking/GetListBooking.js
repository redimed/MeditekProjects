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
            }, {
                attributes: Services.AttributesRoster.Service(),
                model: Service,
                required: true,
                where: pagination.Service
            }, {
                attributes: Services.AttributesAppt.Patient(),
                model: Patient,
                required: true
            }],
            where: pagination.Appointment
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
