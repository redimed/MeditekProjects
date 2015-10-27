module.exports = function(data, userInfo) {
    var $q = require('q');
    var telehealthApointmentCreated;
    var preferringPractitioner;
    var appointmentCreated;
    var teleApptID;
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            if (HelperService.CheckExistData(userInfo) &&
                HelperService.CheckExistData(userInfo.UID)) {
                //find information PreferringPractitioner
                var objectFindPreferringPractitioner = {
                    data: userInfo.UID,
                    transaction: t
                };
                Services.GetPreferringPractictioner(objectFindPreferringPractitioner)
                    .then(function(infoPreferringPractitioner) {
                        if (HelperService.CheckExistData(infoPreferringPractitioner) &&
                            HelperService.CheckExistData(infoPreferringPractitioner.Doctor)) {
                            preferringPractitioner = infoPreferringPractitioner;
                            preferringPractitioner.RefDate = data.TelehealthAppointment.RefDate;
                            preferringPractitioner.RefDurationOfReferal = data.TelehealthAppointment.RefDurationOfReferal;
                            var dataAppointment = Services.GetDataAppointment.AppointmentCreate(data);
                            dataAppointment.UID = UUIDService.Create();
                            dataAppointment.CreatedBy = preferringPractitioner.ID;
                            var objectCreatedAppointment = {
                                data: dataAppointment,
                                transaction: t
                            };
                            //create new Appointment
                            return Services.CreateAppointment(objectCreatedAppointment);
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
                                /* create association Appointment with FileUpload 
                                via RelAppointmentFileUpload */
                                var arrayFileUploadsUnique = _.map(_.groupBy(data.FileUploads, function(FU) {
                                    return FU.UID;
                                }), function(subGrouped) {
                                    return subGrouped[0].UID;
                                });

                                var objectRelAppointmentFileUpload = {
                                    where: arrayFileUploadsUnique,
                                    transaction: t,
                                    appointmentObject: appointmentCreated
                                };
                                return Services.RelAppointmentFileUpload(objectRelAppointmentFileUpload);
                            }
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(RelAppointmentFileUploadAdded) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment) &&
                            HelperService.CheckExistData(appointmentCreated)) {
                            var dataTelehealthAppointment =
                                Services.GetDataAppointment.TelehealthAppointmentCreate(preferringPractitioner.Doctor);
                            dataTelehealthAppointment.UID = UUIDService.Create();
                            dataTelehealthAppointment.CreatedBy = preferringPractitioner.ID;
                            /*create new TelehealthAppointment link with 
                            appointment created via AppointmentID*/
                            var objectCreatedTelehealthAppointment = {
                                data: dataTelehealthAppointment,
                                transaction: t,
                                appointmentCreated: appointmentCreated
                            };
                            return Services.CreateTelehealthAppointment(objectCreatedTelehealthAppointment);
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
                            /*created associated PreferringPractitioner 
                            via Model RelTelehealthAppointmentDoctor*/
                            var objectRelDoctorTelehealthAppointment = {
                                data: preferringPractitioner.Doctor.ID,
                                transaction: t,
                                telehealthApointmentCreated: telehealthApointmentCreated
                            };
                            return Services.RelDoctorTelehealthAppointment(objectRelDoctorTelehealthAppointment);
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
                            /*create new PatientAppointment link with TelehealthAppointment 
                            created via TelehealthAppointmentID*/
                            var objectCreatedPatientAppointment = {
                                data: dataPatientAppointment,
                                transaction: t,
                                telehealthApointmentCreated: telehealthApointmentCreated
                            };
                            return Services.CreateTelehealthPatientAppointment(objectCreatedPatientAppointment);
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
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ExaminationRequired) &&
                            HelperService.CheckExistData(telehealthApointmentCreated)) {
                            var dataExamniationRequired =
                                Services.GetDataAppointment.ExaminationRequired(data.TelehealthAppointment.ExaminationRequired);
                            dataExamniationRequired.UID = UUIDService.Create();
                            dataExamniationRequired.CreatedBy = preferringPractitioner.ID;
                            /*create new ExaminationRequired link with TelehealthAppointment
                            created via TelehealthAppointmentID*/
                            var objectCreateExaminationRequired = {
                                data: dataExamniationRequired,
                                transaction: t,
                                telehealthApointmentCreated: telehealthApointmentCreated
                            };
                            return Services.CreateExaminationRequired(objectCreateExaminationRequired);
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
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PreferredPractitioner) &&
                            _.isArray(data.TelehealthAppointment.PreferredPractitioner)) {
                            var dataPreferredPractitioner =
                                Services.GetDataAppointment.PreferredPractitioners(teleApptID, data.TelehealthAppointment.PreferredPractitioner);
                            dataPreferredPractitioner.UID = UUIDService.Create();
                            /*create new PreferedPlasticSurgeon link with 
                            TelehealthAppointment via TelehealthAppointmentID*/
                            var objectCreatePreferredPractitioner = {
                                data: dataPreferredPractitioner,
                                transaction: t
                            };
                            return Services.BulkCreatePreferredPractitioner(objectCreatePreferredPractitioner);
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
                    .then(function(preferredPractitionerCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ClinicalDetails) &&
                            _.isArray(data.TelehealthAppointment.ClinicalDetails)) {
                            var dataTeleClinicDetail =
                                Services.GetDataAppointment.ClinicalDetails(teleApptID, preferringPractitioner.ID, data.TelehealthAppointment.ClinicalDetails);
                            /*create new list TelehealthClinicalDetails
                            link with TelehealthAppointment via TelehealthAppointmentID*/
                            var objectCreateClinicalDetail = {
                                data: dataTeleClinicDetail,
                                transaction: t
                            };
                            return Services.BulkCreateClinicalDetail(objectCreateClinicalDetail);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(clinicalDetailCreated) {
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
                    error: err
                });
            }
            return defer.promise;
        });
};
