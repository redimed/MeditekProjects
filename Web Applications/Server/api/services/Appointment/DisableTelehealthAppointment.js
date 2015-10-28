/*
DeleteTelehealthAppointment - services: Deleted a Telehealth Appointment
input: UID Telehealth Appointment
output: -success: transaction deleted Teleheath Appointment
        -failed: [transaction] deleted Telehealth Appointment, error message
*/
module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var UIDAppointment = data.UID;
    var IDAppointment = null,
        IDTelehealthAppointment = null;
    return sequelize.transaction()
        .then(function(t) {
            Appointment.findOne({
                    attributes: ['ID'],
                    include: [{
                        attributes: ['ID'],
                        model: TelehealthAppointment,
                        required: true
                    }],
                    where: {
                        UID: UIDAppointment
                    },
                    transaction: t
                })
                .then(function(appointment) {
                    if (HelperService.CheckExistData(appointment)) {
                        IDAppointment = appointment.ID;
                        IDTelehealthAppointment = appointment.TelehealthAppointment.ID;
                        //disable Appointment
                        return Appointment.update({
                            Enable: 'N'
                        }, {
                            where: {
                                ID: IDAppointment
                            }
                        }, {
                            transaction: t
                        });
                    }
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(appointmentDeleted) {
                    //disable Telehealth Appointment
                    return TelehealthAppointment.update({
                        Enable: 'N'
                    }, {
                        where: {
                            ID: IDTelehealthAppointment
                        }
                    }, {
                        transaction: t
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(telehealthAppointmentUpdated) {
                    defer.resolve({
                        transaction: t,
                        status: 'success'
                    });
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                });
            return defer.promise;
        });

};
