module.exports = function(data, userInfo) {
    var $q = require('q');
    var preferringPractitionerObject;
    var appointmentObject;
    var dataPreferredPractitioners;
    var dataClinicalDetails;
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            if (HelperService.CheckExistData(userInfo) &&
                HelperService.CheckExistData(userInfo.UID)) {
                var objectFindPreferringPractitioner = {
                    data: userInfo.UID,
                    transaction: t
                };
                Services.GetPreferringPractictioner(objectFindPreferringPractitioner)
                    .then(function(infoPreferringPractitioner) {
                            if (HelperService.CheckExistData(infoPreferringPractitioner)) {
                                preferringPractitionerObject = infoPreferringPractitioner;
                                var objectFindTelehealthAppointment = {
                                    where: data.UID,
                                    transaction: t
                                };
                                //get PreferringPractitioner object
                                return Services.GetTelehealthAppointmentObject(objectFindTelehealthAppointment);
                            } else {
                                defer.reject({
                                    transaction: t,
                                    error: new Error('permission denied')
                                });
                            }
                        },
                        function(err) {
                            defer.reject({
                                transaction: t,
                                error: err
                            });
                        })
                    .then(function(appointmentObj) {
                        if (HelperService.CheckExistData(appointmentObj) &&
                            HelperService.CheckExistData(preferringPractitionerObject)) {
                            appointmentObject = appointmentObj;
                            var dataAppointment = Services.GetDataAppointment.AppointmentUpdate(data);
                            dataAppointment.ModifiedBy = preferringPractitionerObject.ID;
                            var objectUpdateAppointment = {
                                data: dataAppointment,
                                transaction: t,
                                where: data.UID
                            };
                            //update Appointment
                            return Services.UpdateAppointment(objectUpdateAppointment);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(appointmentUpdated) {
                        if (HelperService.CheckExistData(data.Doctors) &&
                            HelperService.CheckExistData(data.Doctors[0]) &&
                            HelperService.CheckExistData(appointmentObject)) {
                            var objectRelDoctorAppointment = {
                                where: data.Doctors[0].UID,
                                transaction: t,
                                appointmentObject: appointmentObject
                            };
                            //update relDoctorAppointment
                            return Services.RelDoctorAppointment(objectRelDoctorAppointment);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(relDoctorAppointmentUpdated) {
                        if (HelperService.CheckExistData(data.Patients) &&
                            HelperService.CheckExistData(data.Patients[0]) &&
                            HelperService.CheckExistData(appointmentObject)) {
                            var objectRelPatientAppointment = {
                                where: data.Patients[0].UID,
                                transaction: t,
                                appointmentObject: appointmentObject
                            };
                            //update RelPatientAppointment
                            return Services.RelPatientAppointment(objectRelPatientAppointment);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(relPatientAppointmentUpdated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PatientAppointment) &&
                            !_.isEmpty(data.TelehealthAppointment.PatientAppointment) &&
                            HelperService.CheckExistData(preferringPractitionerObject)) {
                            var dataPatientAppointment =
                                Services.GetDataAppointment.PatientAppointmentUpdate(data.TelehealthAppointment.PatientAppointment);
                            dataPatientAppointment.ModifiedBy = preferringPractitionerObject.ID;
                            var objectUpdatePatientAppointment = {
                                data: dataPatientAppointment,
                                where: data.TelehealthAppointment.PatientAppointment.UID,
                                transaction: t
                            };
                            //update PatientAppointment
                            return Services.UpdatePatientAppointment(objectUpdatePatientAppointment);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(telehealthPatientAppointmentUpdated) {
                        if (HelperService.CheckExistData(data.FileUploads) &&
                            _.isArray(data.FileUploads) &&
                            HelperService.CheckExistData(appointmentObject)) {
                            var arrayFileUploadsUnique = _.map(_.groupBy(data.FileUploads, function(FU) {
                                return FU.UID;
                            }), function(subGrouped) {
                                return subGrouped[0].UID;
                            });
                            var objectRelAppointmentFileUpload = {
                                where: arrayFileUploadsUnique,
                                transaction: t,
                                appointmentObject: appointmentObject
                            };
                            //update RelAppointmentFileUpload
                            return Services.RelAppointmentFileUpload(objectRelAppointmentFileUpload);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(relAppointmentFileUploadUpdated) {
                        var telehealthAppointment = data.TelehealthAppointment;
                        if (HelperService.CheckExistData(telehealthAppointment) &&
                            HelperService.CheckExistData(preferringPractitionerObject)) {
                            var dataTelehealthAppointment =
                                Services.GetDataAppointment.TelehealthAppointmentUpdate(telehealthAppointment);
                            dataTelehealthAppointment.ModifiedBy = preferringPractitionerObject.ID;
                            var objectUpdateTelehealthAppointment = {
                                data: dataTelehealthAppointment,
                                where: telehealthAppointment.UID,
                                transaction: t
                            };
                            //update TelehealthAppointment
                            return Services.UpdateTelehealthAppointment(objectUpdateTelehealthAppointment);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(telehealthAppointmentUpdated) {
                        var examinationRequired = data.TelehealthAppointment.ExaminationRequired;
                        if (HelperService.CheckExistData(examinationRequired) &&
                            HelperService.CheckExistData(preferringPractitionerObject)) {
                            var dataExaminationRequired =
                                Services.GetDataAppointment.ExaminationRequired(examinationRequired);
                            dataExaminationRequired.CreatedBy = preferringPractitionerObject.ID;
                            var objectUpdateExaminationrequired = {
                                data: dataExaminationRequired,
                                where: appointmentObject.TelehealthAppointment.ID,
                                transaction: t
                            };
                            //update ExaminationRequired
                            return Services.UpdateExaminationRequired(objectUpdateExaminationrequired);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(examinationRequireUpdated) {
                        var preferredPractitioners = data.TelehealthAppointment.PreferredPractitioners;
                        if (HelperService.CheckExistData(preferredPractitioners) &&
                            _.isArray(preferredPractitioners) &&
                            HelperService.CheckExistData(appointmentObject)) {
                            dataPreferredPractitioners =
                                Services.GetDataAppointment.TelePreferredPractitioners(appointmentObject.TelehealthAppointment.ID, preferredPractitioners);
                            var objectUpdatePreferredPractitioners = {
                                data: dataPreferredPractitioners,
                                where: appointmentObject.TelehealthAppointment.ID,
                                transaction: t,
                                appointmentObject: appointmentObject
                            };
                            //update PreferredPractitioner
                            return Services.UpdatePreferredPractitioner(objectUpdatePreferredPractitioners);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(preferredPractitionerUpdated) {
                        var clinicalDetails = data.TelehealthAppointment.ClinicalDetails;
                        if (HelperService.CheckExistData(clinicalDetails) &&
                            _.isArray(clinicalDetails) &&
                            HelperService.CheckExistData(appointmentObject) &&
                            HelperService.CheckExistData(preferringPractitionerObject)) {
                            dataClinicalDetails =
                                Services.GetDataAppointment.ClinicalDetails(appointmentObject.TelehealthAppointment.ID, preferringPractitionerObject.ID, clinicalDetails);
                            var objectUpdateClinicalDetails = {
                                data: dataClinicalDetails,
                                where: appointmentObject.TelehealthAppointment.ID,
                                transaction: t,
                                appointmentObject: appointmentObject
                            };
                            //update ClinicalDetail
                            return Services.UpdateClinicalDetail(objectUpdateClinicalDetails);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(clinicalDetailUpdated) {
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
            }
            return defer.promise;
        });
};
