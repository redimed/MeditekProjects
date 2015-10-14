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
                                var dataTelehealthAppointment =
                                    Services.GetDataAppointment.TelehealthAppointment(telehealthAppointment);
                                //update TelehealthAppointment
                                return TelehealthAppointment.update(dataTelehealthAppointment, {
                                    where: {
                                        UID: telehealthAppointment.UID
                                    }
                                });
                            } else {
                                defer.reject({
                                    transaction: t,
                                    error: new Error('failed')
                                });
                            }
                        },
                        function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                    .then(function(telehealthAppointmentUpadted) {
                        var examinationRequired = data.TelehealthAppointment.ExaminationRequired;
                        if (HelperService.CheckExistData(examinationRequired)) {
                            var dataExaminationRequired =
                                Services.GetDataAppointment.ExaminationRequired(examinationRequired);
                            //update ExaminationRequired
                            return ExaminationRequired.update(dataExaminationRequired, {
                                where: {
                                    UID: examinationRequired.UID
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
                    .then(function(examinationRequiredUpdate) {
                        var preferedPlasticSurgeon = data.TelehealthAppointment.PreferedPlasticSurgeon;
                        if (HelperService.CheckExistData(preferedPlasticSurgeon)) {
                            var dataPreferedPlasticSurgeon =
                                Services.GetDataAppointment.PreferedPlasticSurgeon(preferedPlasticSurgeon);
                            //update PreferedPlasticSurgeon
                            return PreferedPlasticSurgeon.update(dataPreferedPlasticSurgeon, {
                                where: {
                                    UID: preferedPlasticSurgeon.UID
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
                    .then(function(preferedPlasticSurgeonUpdated) {
                        var dataClinicalDetails = data.TelehealthAppointment.ClinicalDetails;
                        if (HelperService.CheckExistData(dataClinicalDetails) &&
                            _.isArray(dataClinicalDetails)) {
                            //update list Clinical details
                            return sequelize.Promise.each(dataClinicalDetails, function(dataClinicalDetail) {
                                return ClinicalDetail.update(dataClinicalDetail, {
                                    where: {
                                        UID: dataClinicalDetail.UID
                                    }
                                }, {
                                    transaction: t
                                });
                            });
                        }
                    })
                    .then(function(clinicalDetailsUpdated) {
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
