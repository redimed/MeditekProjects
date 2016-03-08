module.exports = function(objCreate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objCreate) &&
        !_.isEmpty(objCreate.data)) {
        return AppointmentData.bulkCreate(objCreate.data, {
            transaction: objCreate.transaction
        });
    } else {
        var error = new Error('CreateAppointmentData.data.not.exist');
        defer.resolve(error);
    }
    return defer.promise;
};
