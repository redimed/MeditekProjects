module.exports = function(data, userInfo) {
    var $q = require('q');
    var telehealthAppointmentObject;
    var preferringPractitioner;
    var appointmentObject;
    var teleApptID;
    return sequelize.transaction()
        .then(function(t) {
            var defer = $q.defer();
            if (HelperService.CheckExistData(userInfo) &&
                HelperService.CheckExistData(userInfo.UID)) {
                var objectFindPreferringPractitioner = {
                    data: userInfo.UID,
                    transaction: t
                };
                //find information PreferringPractitioner
                Services.GetPreferringPractictioner(objectFindPreferringPractitioner)
                    .then(function(infoPreferringPractitioner) {
                        if (HelperService.CheckExistData(infoPreferringPractitioner) &&
                            HelperService.CheckExistData(infoPreferringPractitioner.Doctor)) {
                            preferringPractitioner = infoPreferringPractitioner;
                            preferringPractitioner = Services.GetDataAppointment.AddDataPreferredPractitioner(preferringPractitioner, data.TelehealthAppointment);
                            var dataAppointment = Services.GetDataAppointment.AppointmentCreate(data);
                            dataAppointment.UID = UUIDService.Create();
                            dataAppointment.CreatedBy = preferringPractitioner.ID;
                            var objectCreatedAppointment = {
                                data: dataAppointment,
                                transaction: t
                            };
                            //create new Appointment
                            return Services.CreateAppointment(objectCreatedAppointment);
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('permission denied')
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
                            appointmentObject = apptCreated;
                            if (HelperService.CheckExistData(data.TelehealthAppointment) &&
                                HelperService.CheckExistData(appointmentObject)) {
                                var dataTelehealthAppointment =
                                    Services.GetDataAppointment.TelehealthAppointmentCreate(preferringPractitioner.Doctor);
                                dataTelehealthAppointment.UID = UUIDService.Create();
                                dataTelehealthAppointment.CreatedBy = preferringPractitioner.ID;
                                dataTelehealthAppointment.Type = 'WAA';
                                var objectCreatTelehealthAppointment = {
                                    data: dataTelehealthAppointment,
                                    transaction: t,
                                    appointmentObject: appointmentObject
                                };
                                //create new TelehealthAppointment
                                return Services.CreateTelehealthAppointment(objectCreatTelehealthAppointment);
                            } else {
                                defer.reject({
                                    transaction: t,
                                    error: new Error('failed')
                                });
                            }
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(telehealthApptCreated) {
                        if (HelperService.CheckExistData(telehealthApptCreated)) {
                            telehealthAppointmentObject = telehealthApptCreated;
                            teleApptID =
                                (!_.isUndefined(telehealthAppointmentObject.dataValues) ?
                                    telehealthAppointmentObject.dataValues.ID : null);
                            //create new WAAppointment
                            if (HelperService.CheckExistData(data.TelehealthAppointment.WAAppointment)) {
                                var dataWAAppointment =
                                    Services.GetDataAppointment.WAAppointment(data.TelehealthAppointment.WAAppointment);
                                dataWAAppointment.UID = UUIDService.Create();
                                dataWAAppointment.CreatedBy = preferringPractitioner.ID;
                                var objectCreatWAAppointment = {
                                    data: dataWAAppointment,
                                    transaction: t,
                                    telehealthAppointmentObject: telehealthAppointmentObject
                                };
                                return Services.CreateWAAppointment(objectCreatWAAppointment);
                            }
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(WAappointmentCreated) {
                        if (HelperService.CheckExistData(telehealthAppointmentObject)) {
                            var objectRelDoctorTelehealthAppointment = {
                                data: preferringPractitioner.Doctor.ID,
                                transaction: t,
                                telehealthAppointmentObject: telehealthAppointmentObject
                            };
                            //created PreferringPractitioner
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
                            HelperService.CheckExistData(telehealthAppointmentObject)) {
                            var dataPatientAppointment =
                                Services.GetDataAppointment.PatientAppointmentCreate(data.TelehealthAppointment.PatientAppointment);
                            dataPatientAppointment.UID = UUIDService.Create();
                            dataPatientAppointment.CreatedBy = preferringPractitioner.ID;
                            var objectCreatedPatientAppointment = {
                                data: dataPatientAppointment,
                                transaction: t,
                                telehealthAppointmentObject: telehealthAppointmentObject
                            };
                            //create new PatientAppointment
                            return Services.CreatePatientAppointment(objectCreatedPatientAppointment);
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
                    .then(function(patientappointmentObject) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.PreferredPractitioner) &&
                            _.isArray(data.TelehealthAppointment.PreferredPractitioner)) {
                            var dataPreferredPractitioner =
                                Services.GetDataAppointment.TelePreferredPractitioners(teleApptID, data.TelehealthAppointment.PreferredPractitioner);
                            dataPreferredPractitioner.UID = UUIDService.Create();
                            var objectCreatePreferredPractitioner = {
                                data: dataPreferredPractitioner,
                                transaction: t
                            };
                            //create new PreferedPlastitioner
                            return Services.BulkCreatePreferredPractitioner(objectCreatePreferredPractitioner);
                        } else {
                            defer.reject({
                                transaction: t,
                                error: new Error('failed')
                            });
                        }
                    })
                    .then(function(preferredPractitionerCreated) {
                        if (HelperService.CheckExistData(data.TelehealthAppointment.ClinicalDetails) &&
                            _.isArray(data.TelehealthAppointment.ClinicalDetails)) {
                            var dataTeleClinicDetail =
                                Services.GetDataAppointment.ClinicalDetails(teleApptID, preferringPractitioner.ID, data.TelehealthAppointment.ClinicalDetails);
                            var objectCreateClinicalDetail = {
                                data: dataTeleClinicDetail,
                                telehealthAppointmentObject: telehealthAppointmentObject,
                                transaction: t
                            };
                            //create new ClinicalDetails
                            return Services.CreateClinicalDetailWAAppointment(objectCreateClinicalDetail);
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
