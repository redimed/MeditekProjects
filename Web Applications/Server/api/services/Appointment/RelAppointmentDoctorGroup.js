module.exports = function(objRel) {
    var $q = require('q')
    var defer = $q.defer();
    var error = new Error('RelAppointmentGroupDoctor');
    if (!_.isEmpty(objRel) &&
        !_.isEmpty(objRel.where)) {
        return Doctor.findAll({
                attributes: ['ID'],
                transaction: objRel.transaction,
                include: [{
                    attributes: ['UID'],
                    model: DoctorGroup,
                    where: {
                        Enable: 'Y',
                        $or: objRel.where
                    },
                    required: true,
                    through: {
                        where: {
                            Active: 'Y'
                        }
                    }
                }]
            })
            .then(function(doctorIDRes) {
                doctorIDRes = _.map(doctorIDRes, 'ID');
                return objRel.appointmentObject.addDoctor(doctorIDRes, {
                    transaction: objRel.transaction
                });
            }, function(err) {
                error.pushError(err)
                defer.reject(error);
            })
            .then(function(relApptDoctorCreated) {
                defer.resolve(relApptDoctorCreated);
            }, function(err) {
                error.pushError(err)
                defer.reject(error);
            });
    } else {
        error.pushError('objRel.where.isEmpty')
        defer.reject(error);
    }
    return defer.pormise;
}
