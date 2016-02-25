module.exports = function(UIDAppointment, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    Appointment.findOne({
            attributes: Services.AttributesAppt.Appointment(),
            include: [{
                attributes: Services.AttributesRoster.Service(),
                model: Service,
                required: true
            }, {
                attributes: Services.AttributesRoster.Site(),
                model: Site,
                required: true
            }, {
                attributes: Services.AttributesAppt.Patient(),
                model: Patient,
                required: true
            }, {
                attributes: Services.AttributesAppt.Doctor(),
                model: Doctor,
                required: true
            }],
            where: {
                UID: UIDAppointment,
                Enable: 'Y'
            }
        })
        .then(function(apptRes) {
            defer.resolve({
                data: apptRes
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
