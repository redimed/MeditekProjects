module.exports = function(data) {
    var $q = require('q');
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            var dataAppointment = Services.GetDataAppointment.Appointment(data);
            //update Appointment
            Appointment.update(dataAppointment, {
                    where: {
                        UID: data.UID
                    }
                }, {
                    transaction: t
                })
                .then(function(appointmentUpdated) {
                    var telehealthAppointment = data.TelehealthAppointment;
                    if (HelperService.CheckExistData(telehealthAppointment)) {
                        //update telehealth appointment
                        var dataTelehealthAppointment =
                            Services.GetDataAppointment.TelehealthAppointment(telehealthAppointment);
                        return TelehealthAppointment.update(dataTelehealthAppointment, {
                            transaction: t
                        });
                    } else {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    }
                }, function(err) {
                    defer.reject({
                        transaction: t,
                        error: err
                    });
                })
                .then(function(telehealthAppointmentUpdated) {
                    var examinationRequired = data.TelehealthAppointment.ExaminationRequired;
                    if (HelperService.CheckExistData(examinationRequired)) {
                        return ExaminationRequired.update(examinationRequired, {
                            transaction: t
                        });
                    } else {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    }
                })
                .then(function(examinationRequiredUpdated) {
                    var preferedPlasticSurgeon = data.TelehealthAppointment.PreferedPlasticSurgeon;
                    if (HelperService.CheckExistData(preferedPlasticSurgeon)) {
                        var dataPreferedPlasticSurgeon =
                            Services.GetDataAppointment.PreferedPlasticSurgeon(preferedPlasticSurgeon);
                        return PreferedPlasticSurgeon.update(dataPreferedPlasticSurgeon, {
                            transaction: t
                        });
                    } else {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    }
                })
                .then(function(preferedPlasticSurgeonUpdated) {
                    var clinicalDetails = data.TelehealthAppointment.PreferedPlasticSurgeon.ClinicalDetails;
                    if (HelperService.CheckExistData(clinicalDetails)) {
                        //update mutiple row
                        return;
                    } else {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    }
                })
                .then(function(clinicalDetailUpdated) {
                    defer.resolve({
                        transaction: t,
                        status: 'success'
                    });
                });

            return defer.promise;
        });
};
