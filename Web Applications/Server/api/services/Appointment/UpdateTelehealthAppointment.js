    module.exports = function(data) {
        var $q = require('q');
        var preferringPractitionerObject;
        var appointmentObject;
        var dataPreferedPlasticSurgeons;
        var dataClinicalDetails;
        return sequelize.transaction()
            .then(function(t) {
                var defer = $q.defer();
                if (HelperService.CheckExistData(data.UserInfo) &&
                    HelperService.CheckExistData(data.UserInfo.UID)) {
                    //get PreferringPractitioner object
                    UserAccount.findOne({
                            attributes: ['ID'],
                            include: [{
                                attributes: ['ID'],
                                model: Doctor,
                                required: true
                            }],
                            where: {
                                UID: data.UserInfo.UID
                            },
                            transaction: t
                        })
                        .then(function(preferPractitionerObj) {
                            if (HelperService.CheckExistData(preferPractitionerObj) &&
                                HelperService.CheckExistData(preferPractitionerObj.Doctor)) {
                                preferringPractitionerObject = preferPractitionerObj.Doctor;
                                //get Appointment object
                                return Appointment.findOne({
                                    attributes: ['ID'],
                                    include: [{
                                        model: TelehealthAppointment,
                                        attributes: ['ID'],
                                        required: true
                                    }],
                                    where: {
                                        UID: data.UID
                                    },
                                    transaction: t
                                });

                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(appointmentObj) {
                            if (HelperService.CheckExistData(appointmentObj)) {
                                appointmentObject = appointmentObj;
                                var dataAppointment = Services.GetDataAppointment.AppointmentUpdate(data);
                                dataAppointment.ModifiedBy = preferringPractitionerObject.ID;
                                //update Appointment
                                return Appointment.update(dataAppointment, {
                                    where: {
                                        UID: data.UID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(appointmentUpdated) {
                            if (HelperService.CheckExistData(data.Doctors) &&
                                HelperService.CheckExistData(data.Doctors[0])) {
                                var informationDoctor = data.Doctors[0];
                                //get Doctor object 
                                return Doctor.findOne({
                                    attributes: ['ID'],
                                    where: {
                                        UID: informationDoctor.UID
                                    },
                                    transaction: t
                                });
                            }

                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(doctorObj) {
                            if (HelperService.CheckExistData(doctorObj) &&
                                HelperService.CheckExistData(doctorObj.ID) &&
                                HelperService.CheckExistData(appointmentObject)) {
                                //link Appointment updated with Doctor object received
                                return appointmentObject.setDoctors(doctorObj.ID, {
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(relDoctorAppointmentCreated) {
                            if (HelperService.CheckExistData(data.Patients) &&
                                HelperService.CheckExistData(data.Patients[0])) {
                                var informationPatient = data.Patients[0];
                                //get Patient object
                                return Patient.findOne({
                                    attributes: ['ID'],
                                    where: {
                                        UID: informationPatient.UID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(patientObject) {
                            if (HelperService.CheckExistData(patientObject) &&
                                HelperService.CheckExistData(patientObject.ID) &&
                                HelperService.CheckExistData(appointmentObject)) {
                                //link Appointment updated with patient object received
                                return appointmentObject.setPatients(patientObject.ID, {
                                    transaction: t
                                });
                            }
                        })
                        .then(function(relPatientAppointmentCreated) {
                            if (HelperService.CheckExistData(data.FileUploads) &&
                                _.isArray(data.FileUploads) &&
                                HelperService.CheckExistData(appointmentObject)) {
                                var arrayFileUploadsUnique = _.map(_.groupBy(data.FileUploads, function(FU) {
                                    return FU.UID;
                                }), function(subGrouped) {
                                    return subGrouped[0].UID;
                                });
                                return FileUpload.findAll({
                                    attributes: ['ID'],
                                    where: {
                                        UID: {
                                            $in: arrayFileUploadsUnique
                                        }
                                    },
                                    transaction: t
                                });
                            }

                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(IDFileUploads) {
                            if (HelperService.CheckExistData(IDFileUploads) &&
                                _.isArray(IDFileUploads)) {
                                return appointmentObject.setFileUploads(IDFileUploads, {
                                    transaction: t
                                });
                            }
                        })
                        .then(function(relAppointmentFileUploadCreated) {
                            var telehealthAppointment = data.TelehealthAppointment;
                            if (HelperService.CheckExistData(telehealthAppointment)) {
                                var dataTelehealthAppointment =
                                    Services.GetDataAppointment.TelehealthAppointmentUpdate(telehealthAppointment);
                                dataTelehealthAppointment.ModifiedBy = preferringPractitionerObject.ID;
                                //update TelehealthAppointment
                                return TelehealthAppointment.update(dataTelehealthAppointment, {
                                    where: {
                                        UID: telehealthAppointment.UID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
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
                                dataExaminationRequired.CreatedBy = preferringPractitionerObject.ID;
                                //update ExaminationRequired
                                return ExaminationRequired.update(dataExaminationRequired, {
                                    where: {
                                        UID: examinationRequired.UID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(examinationRequiredUpdated) {
                            var preferedPlasticSurgeon = data.TelehealthAppointment.PreferedPlasticSurgeon;
                            if (HelperService.CheckExistData(preferedPlasticSurgeon) &&
                                _.isArray(preferedPlasticSurgeon) &&
                                HelperService.CheckExistData(appointmentObject)) {
                                dataPreferedPlasticSurgeons =
                                    Services.GetDataAppointment.PreferedPlasticSurgeon(appointmentObject.TelehealthAppointment.ID, preferedPlasticSurgeon);
                                //remove PreferedPlasticSurgeons
                                return PreferedPlasticSurgeon.destroy({
                                    where: {
                                        TelehealthAppointmentID: appointmentObject.TelehealthAppointment.ID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(preferedPlasticSurgeonDeleted) {
                            if (HelperService.CheckExistData(dataPreferedPlasticSurgeons) &&
                                _.isArray(dataPreferedPlasticSurgeons)) {
                                //created new PreferedPlasticSurgeons
                                return PreferedPlasticSurgeon.bulkCreate(dataPreferedPlasticSurgeons, {
                                    transaction: t
                                });
                            }
                        })
                        .then(function(preferedPlasticSurgeonUpdated) {
                            var clinicalDetails = data.TelehealthAppointment.ClinicalDetails;
                            if (HelperService.CheckExistData(clinicalDetails) &&
                                _.isArray(clinicalDetails) &&
                                HelperService.CheckExistData(appointmentObject)) {
                                dataClinicalDetails =
                                    Services.GetDataAppointment.ClinicalDetails(appointmentObject.TelehealthAppointment.ID, preferringPractitionerObject.ID, clinicalDetails);
                                //remove ClinicalDetails
                                ClinicalDetail.destroy({
                                    where: {
                                        TelehealthAppointmentID: appointmentObject.TelehealthAppointment.ID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(clinicalDetailsDeleted) {
                            if (HelperService.CheckExistData(dataClinicalDetails) &&
                                _.isArray(dataClinicalDetails)) {
                                //create new ClinicalDetails
                                return ClinicalDetail.bulkCreate(dataClinicalDetails, {
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                        .then(function(clinicalDetailsCreated) {
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
                } else {
                    defer.reject({
                        transaction: t,
                        error: new Error('failed')
                    });
                }
                return defer.promise;
            });
    };
