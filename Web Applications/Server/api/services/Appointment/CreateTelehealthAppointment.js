module.exports = function(data) {
    var $q = require('q');
    var telehealthApointmentCreated;
    var preferringPractitioner;
    var appointmentCreated;
    var teleApptID;
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            if (HelperService.CheckExistData(data.UserInfo) &&
                HelperService.CheckExistData(data.UserInfo.UID)) {
                //find information PreferringPractitioner
                UserAccount.findOne({
                        attributes: ['ID'],
                        include: [{
                            attributes: ['ID', 'FirstName', 'MiddleName', 'LastName',
                                'HealthLink', 'Address1', 'Address2', 'HomePhoneNumber', 'PostCode',
                                'ProviderNumber', 'Signature', 'WorkPhoneNumber'
                            ],
                            model: Doctor,
                            required: true
                        }],
                        where: {
                            UID: data.UserInfo.UID
                        },
                        transaction: t
                    })
                    .then(function(preferPractitioner) {
                        if (HelperService.CheckExistData(preferPractitioner) &&
                            HelperService.CheckExistData(preferPractitioner.Doctor)) {
                            preferringPractitioner = preferPractitioner.Doctor;
                            preferringPractitioner.RefDate = data.TelehealthAppointment.RefDate;
                            preferringPractitioner.RefDurationOfReferal = data.TelehealthAppointment.RefDurationOfReferal;
                            var dataAppointment = Services.GetDataAppointment.AppointmentCreate(data);
                            dataAppointment.UID = UUIDService.Create();
                            dataAppointment.CreatedBy = preferringPractitioner.ID;
                            //create new Appointment
                            return Appointment.create(dataAppointment, {
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(apptCreated) {
                        if (HelperService.CheckExistData(apptCreated)) {
                            appointmentCreated = apptCreated;
                            if (HelperService.CheckExistData(data.FileUploads) &&
                                _.isArray(data.FileUploads)) {
                                /*
                                create association Appointment with FileUpload 
                                via RelAppointmentFileUpload
                                */
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
                        }

                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(IDFileUploads) {
                        if (HelperService.CheckExistData(IDFileUploads) &&
                            _.isArray(IDFileUploads) &&
                            HelperService.CheckExistData(appointmentCreated)) {
                            return appointmentCreated.addFileUploads(IDFileUploads, {
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(associationAppointmentFileUploadCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment) &&
                            HelperService.CheckExistData(appointmentCreated)) {
                            var dataTelehealthAppointment =
                                Services.GetDataAppointment.TelehealthAppointmentCreate(preferringPractitioner);
                            dataTelehealthAppointment.UID = UUIDService.Create();
                            dataTelehealthAppointment.CreatedBy = preferringPractitioner.ID;
                            /*
                            create new TelehealthAppointment link with 
                            appointment created via AppointmentID 
                            */
                            return appointmentCreated.createTelehealthAppointment(dataTelehealthAppointment, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(telehealthApptCreated) {
                        if (HelperService.CheckExistData(telehealthApptCreated)) {
                            telehealthApointmentCreated = telehealthApptCreated;
                            teleApptID = (!_.isUndefined(telehealthApointmentCreated.dataValues) ? telehealthApointmentCreated.dataValues.ID : null);
                            /*
                            created associated PreferringPractitioner 
                            via Model RelTelehealthAppointmentDoctor
                            */
                            return telehealthApointmentCreated.addDoctor(preferringPractitioner.ID, {
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(relTelehealthAppointmentDoctorCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PatientAppointment) &&
                            HelperService.CheckExistData(telehealthApointmentCreated)) {
                            var dataPatientAppointment =
                                Services.GetDataAppointment.PatientAppointmentCreate(data.TelehealthAppointment.PatientAppointment);
                            dataPatientAppointment.UID = UUIDService.Create();
                            dataPatientAppointment.CreatedBy = preferringPractitioner.ID;
                            /*
                            create new PatientAppointment link with TelehealthAppointment 
                            created via TelehealthAppointmentID
                            */
                            return telehealthApointmentCreated.createPatientAppointment(dataPatientAppointment, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    //link patient with telehealth appointment
                    .then(function(patientAppointmentCreated) {
                        if (HelperService.CheckExistData(data.Patient) &&
                            HelperService.CheckExistData(data.Patient.UID)) {
                            //find patient
                            return Patient.findOne({
                                attributes: ['ID'],
                                where: {
                                    UID: data.Patient.UID
                                },
                                transaction: t
                            });
                        }
                    })
                    .then(function(infoPatient) {
                        if (HelperService.CheckExistData(infoPatient) &&
                            HelperService.CheckExistData(appointmentCreated)) {
                            //association appointment with patient
                            return appointmentCreated.addPatient(infoPatient.ID, {
                                transaction: t
                            });
                        }
                    })
                    .then(function(patientAppointmentCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ExaminationRequired) &&
                            HelperService.CheckExistData(telehealthApointmentCreated)) {
                            var dataExamniationRequired =
                                Services.GetDataAppointment.ExaminationRequired(data.TelehealthAppointment.ExaminationRequired);
                            dataExamniationRequired.UID = UUIDService.Create();
                            dataExamniationRequired.CreatedBy = preferringPractitioner.ID;
                            /*
                            create new ExaminationRequired link with TelehealthAppointment
                            created via TelehealthAppointmentID
                            */
                            return telehealthApointmentCreated.createExaminationRequired(dataExamniationRequired, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(examinationRequiredCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PreferedPlasticSurgeon) &&
                            _.isArray(data.TelehealthAppointment.PreferedPlasticSurgeon)) {
                            var dataPrefPlasSurgon =
                                Services.GetDataAppointment.PreferedPlasticSurgeon(teleApptID, data.TelehealthAppointment.PreferedPlasticSurgeon);
                            dataPrefPlasSurgon.UID = UUIDService.Create();
                            /*
                            create new PreferedPlasticSurgeon
                            link with TelehealthAppointment via TelehealthAppointmentID
                            */
                            return PreferedPlasticSurgeon.bulkCreate(dataPrefPlasSurgon, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(preferedPlasticSurgeonCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ClinicalDetails) &&
                            _.isArray(data.TelehealthAppointment.ClinicalDetails)) {
                            var dataTeleClinicDetail =
                                Services.GetDataAppointment.ClinicalDetails(teleApptID, preferringPractitioner.ID, data.TelehealthAppointment.ClinicalDetails);
                            /*
                            create new list TelehealthClinicalDetails
                            link with TelehealthAppointment via TelehealthAppointmentID
                            */
                            return ClinicalDetail.bulkCreate(dataTeleClinicDetail, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
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
