module.exports = function(objUpdate) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('UpdateAppointmentData');
    if (!_.isEmpty(objUpdate) &&
        !_.isEmpty(objUpdate.data) &&
        HelperService.CheckExistData(objUpdate.where)) {
        AppointmentData.destroy({
                where: {
                    AppointmentID: objUpdate.where
                },
                transaction: objUpdate.transaction
            })
            .then(function(apptDataDeleted) {
                var objCreateApptData = {
                    data: objUpdate.data,
                    transaction: objUpdate.transaction
                };
                return Services.CreateAppointmentData(objCreateApptData);
            }, function(err) {
                error.pushError(err);
                defer.reject(error);
            })
            .then(function(apptDataCreated) {
                defer.resolve(apptDataCreated);
            }, function(err) {
                error.pushError('objUpdate.isEmpty');
                defer.reject(error);
            });
    } else {
        error.pushError('objUpdate.isEmpty');
        defer.reject(error);
    }
    return defer.promise;
};
