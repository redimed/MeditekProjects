module.exports = function(data) {
    var $q = require('q');
    var telehealthApointmentCreated, PreferringPractitioner, appointmentCreated;
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
                                'HealthLink', 'Address', 'PhoneNumber', 'PostCode',
                                'ProviderNumber', 'Signature'
                            ],
                            model: Doctor,
                            required: true
                        }],
                        where: {
                            UID: data.UserInfo.UID
                        },
                        transaction: t
                    })
                    .then(function(preferringPractitioner) {
                        if (HelperService.CheckExistData(preferringPractitioner) &&
                            HelperService.CheckExistData(preferringPractitioner.Doctor)) {
                            PreferringPractitioner = preferringPractitioner.Doctor;
                            PreferringPractitioner.RefDate = data.TelehealthAppointment.RefDate;
                            PreferringPractitioner.RefDurationOfReferal = data.TelehealthAppointment.RefDurationOfReferal;
                            var dataAppointment = Services.GetDataAppointment.AppointmentCreate(data);
                            dataAppointment.UID = UUIDService.Create();
                            dataAppointment.CreatedBy = PreferringPractitioner.ID;
                            //create Appointment
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
                        appointmentCreated = apptCreated;
                        if (HelperService.CheckExistData(data.FileUploads) &&
                            _.isArray(data.FileUploads)) {
                            /*create association Appointment with FileUpload 
                        via RelAppointmentFileUpload*/
                            appointmentCreated.addFileUploads(data.FileUploads, {
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
                        if (HelperService.CheckExistData(data.TelehealthAppointment)) {
                            var dataTelehealthAppointment =
                                Services.GetDataAppointment.TelehealthAppointmentCreate(PreferringPractitioner);
                            dataTelehealthAppointment.UID = UUIDService.Create();
                            dataTelehealthAppointment.CreatedBy = PreferringPractitioner.ID;
                            /*create new TelehealthAppointment link with 
                              appointment created via AppointmentID */
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
                        telehealthApointmentCreated = telehealthApptCreated;
                        /*
                        Created associated PreferringPractitioner 
                        via Model RelTelehealthAppointmentDoctor
                        */
                        return telehealthApointmentCreated.addDoctor(PreferringPractitioner.ID, {
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(relTelehealthAppointmentDoctorCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PatientAppointment)) {
                            var dataPatientAppointment =
                                Services.GetDataAppointment.PatientAppointmentCreate(data.TelehealthAppointment.PatientAppointment);
                            dataPatientAppointment.UID = UUIDService.Create();
                            dataPatientAppointment.CreatedBy = PreferringPractitioner.ID;
                            /*create new PatientAppointment link with TelehealthAppointment 
                              created via TelehealthAppointmentID*/
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
                    .then(function(patientAppointmentCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ExaminationRequired)) {
                            var dataExamniationRequired =
                                Services.GetDataAppointment.ExaminationRequiredCreate(data.TelehealthAppointment.ExaminationRequired);
                            dataExamniationRequired.UID = UUIDService.Create();
                            dataExamniationRequired.CreatedBy = PreferringPractitioner.ID;
                            /*create new ExaminationRequired link with TelehealthAppointment
                              created via TelehealthAppointmentID*/
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
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PreferedPlasticSurgeon)) {
                            var dataPrefPlasSurgon =
                                Services.GetDataAppointment.PreferedPlasticSurgeonCreate(data.TelehealthAppointment.PreferedPlasticSurgeon);
                            dataPrefPlasSurgon.UID = UUIDService.Create();
                            /*create new PreferedPlasticSurgeon
                              link with TelehealthAppointment via TelehealthAppointmentID*/
                            return telehealthApointmentCreated.createPreferedPlasticSurgeon(dataPrefPlasSurgon, {
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
                        var teleApptID = (!_.isUndefined(telehealthApointmentCreated.dataValues) ? telehealthApointmentCreated.dataValues.ID : null);
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ClinicalDetails)) {
                            var dataTeleClinicDetail =
                                Services.GetDataAppointment.ClinicalDetailsCreate(teleApptID, PreferringPractitioner.ID, data.TelehealthAppointment.ClinicalDetails);
                            /*create new list TelehealthClinicalDetails
                              link with TelehealthAppointment via TelehealthAppointmentID*/
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
