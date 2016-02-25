module.exports = function(objCreate) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(objCreate) &&
        !_.isEmpty(objCreate.data)) {
        if (!_.isEmpty(objCreate.appointmentObject)) {
            return objCreate.appointmentObject.createOnsiteAppointment(objCreate.data, {
                transaction: objCreate.transaction
            });
        } else {
            return OnsiteAppointment.create(objCreate.data, {
                transaction: objCreate.transaction
            });
        }
    } else {
        var error = new Error('objCreate.data.not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
