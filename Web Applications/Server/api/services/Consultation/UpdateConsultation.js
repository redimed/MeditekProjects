var $q = require('q');
module.exports = function(data, userInfo) {
    var defer = $q.defer();
    return sequelize.transaction()
        .then(function(t) {
            var AppointmentUID = data.UID;
            console.log('AppointmentUID', AppointmentUID);
            return defer.promise;
        });
};
