module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var appointmentObject = null;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.PatientAppointment)) {
        sequelize.transaction()
            .then(function(t) {
                    var dataAppt = Services.GetDataAppointment.AppointmentCreate(data);
                    dataAppt.UID = UUIDService.Create();
                    if (!_.isEmpty(userInfo)) {
                        dataAppt.CreatedBy = userInfo.ID;
                    }
                    var objectCreateAppt = {
                        data: dataAppt,
                        transaction: t
                    };
                    return Services.CreateAppointment(objectCreateAppt)
                        .then(function(apptCreated) {
                            if (!_.isEmpty(apptCreated)) {
                                appointmentObject = apptCreated;
                                var dataTeleAppt = {
                                    UID: UUIDService.Create(),
                                    Type: 'TEL'
                                };
                                if (data.Type === 'Telehealth') {
                                    dataTeleAppt.Description = data.Description;
                                }
                                var objectCreateTeleAppt = {
                                    data: dataTeleAppt,
                                    transaction: t,
                                    appointmentObject: appointmentObject
                                };
                                return Services.CreateTelehealthAppointment(objectCreateTeleAppt);
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(teleApptCreated) {
                            if (!_.isEmpty(teleApptCreated)) {
                                var dataPatientAppt = data.PatientAppointment;
                                dataPatientAppt.UID = UUIDService.Create();
                                if (!_.isEmpty(userInfo)) {
                                    dataPatientAppt.CreatedBy = userInfo.ID;
                                }
                                var objectCreatePatientAppt = {
                                    data: dataPatientAppt,
                                    telehealthAppointmentObject: teleApptCreated,
                                    transaction: t
                                };
                                return Services.CreatePatientAppointment(objectCreatePatientAppt);
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(patientAppointmentCreated) {
                            if (data.Type === 'Onsite' &&
                                HelperService.CheckExistData(data.Description)) {
                                var objCreateOnsiteAppt = {
                                    data: {
                                        Description: data.Description
                                    },
                                    transaction: t,
                                    appointmentObject: appointmentObject
                                };
                                return Services.CreateOnsiteAppointment(objCreateOnsiteAppt);
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(onsiteApptCreated) {
                            if (!_.isEmpty(data.FileUploads) &&
                                _.isArray(data.FileUploads) &&
                                !_.isEmpty(appointmentObject)) {
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
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(relApptFileUploadCreated) {
                            if (!_.isEmpty(userInfo)) {
                                return Patient.findOne({
                                    attributes: ['ID'],
                                    where: {
                                        UserAccountID: userInfo.ID
                                    },
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t,
                                raw: true
                            });
                        })
                        .then(function(patientRes) {
                            if (!_.isEmpty(patientRes) &&
                                !_.isEmpty(appointmentObject)) {
                                return appointmentObject.setPatients(patientRes.ID, {
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject(err);
                        })
                        .then(function(relPatientApptCreated) {
                            defer.resolve({
                                status: 'success',
                                transaction: t
                            })
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                },
                function(err) {
                    defer.reject(err);
                });
    } else {
        var error = new Error('data.failed');
        defer.reject(error);
    }
    return defer.promise;
};
