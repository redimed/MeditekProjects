    module.exports = function(data) {
        var $q = require('q');
        return sequelize.transaction()
            .then(function(t) {
                var defer = $q.defer();
                var dataAppointment = Services.GetDataAppointment.Appointment(data);
                //add chainer update Appointment
                return Appointment.update(dataAppointment, {
                    where: {
                        UID: data.UID
                    }
                }, {
                    transaction: t
                });
                var telehealthAppointment = data.TelehealthAppointment;
                if (HelperService.CheckExistData(telehealthAppointment)) {
                    var dataTelehealthAppointment =
                        Services.GetDataAppointment.TelehealthAppointment(telehealthAppointment);
                    //add chainer update Telehealth Appointemnt
                    return TelehealthAppointment.update(dataTelehealthAppointment, {
                        where: {
                            UID: telehealthAppointment.UID
                        }
                    });
                    var examinationRequired = data.TelehealthAppointment.ExaminationRequired;
                    if (HelperService.CheckExistData(examinationRequired)) {
                        var dataExaminationRequired =
                            Services.GetDataAppointment.ExaminationRequired(examinationRequired);
                        //add chainer update ExaminationRequired
                        ExaminationRequired.update(dataExaminationRequired, {
                            where: {
                                UID: examinationRequired.UID
                            }
                        }, {
                            transaction: t
                        });
                    }
                    var preferedPlasticSurgeon = data.TelehealthAppointment.PreferedPlasticSurgeon;
                    if (HelperService.CheckExistData(preferedPlasticSurgeon)) {
                        var dataPreferedPlasticSurgeon =
                            Services.GetDataAppointment.PreferedPlasticSurgeon(preferedPlasticSurgeon);
                        //add chainer update PreferedPlasticSurgeon
                        PreferedPlasticSurgeon.update(dataPreferedPlasticSurgeon, {
                            where: {
                                UID: preferedPlasticSurgeon.UID
                            }
                        }, {
                            transaction: t
                        });
                    }
                    var clinicalDetails = data.TelehealthAppointment.ClinicalDetails;
                    if (HelperService.CheckExistData(clinicalDetails)) {
                        var dataClinicalDetails = Services.GetDataAppointment.ClinicalDetail(clinicalDetails);
                        //add chainer update ClinicalDetail
                        dataClinicalDetails.forEach(function(item, index) {
                            ClinicalDetail.update(item, {
                                where: {
                                    UID: dataClinicalDetails[index].UID
                                }
                            }, {
                                transaction: t
                            });
                        });
                    }
                }
                return defer.promise;
            });
    };
