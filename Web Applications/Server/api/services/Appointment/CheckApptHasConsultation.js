module.exports = function(apptUID) {
    var $q = require('q');
    var defer = $q.defer();
    if (apptUID) {
        Appointment.findOne({
                attributes: [],
                include: [{
                    attributes: ['UID'],
                    model: Consultation,
                    required: true,
                    through: {
                        attributes: []
                    }
                }],
                where: {
                    UID: apptUID
                }
            })
            .then(function(consultation) {
                defer.resolve({ data: consultation });
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        defer.reject({ error: new Error('apptUID.isEmpty') });
    }
    return defer.promise;
};
