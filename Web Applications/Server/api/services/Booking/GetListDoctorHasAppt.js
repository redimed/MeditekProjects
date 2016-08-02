module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Doctor);
    Doctor.findAll({
            attributes: Services.AttributesAppt.Doctor(),
            include: [{
                attributes: ['ID'],
                model: Appointment,
                where: pagination.Appointment
            }],
            where: pagination.Doctor
        })
        .then(function(listDoctor) {
            defer.resolve({data: listDoctor});
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
