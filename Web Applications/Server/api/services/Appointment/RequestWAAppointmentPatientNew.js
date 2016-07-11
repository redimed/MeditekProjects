module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var appointmentObject = null;
    var apptUID = null;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.PatientAppointment)) {
        sequelize.transaction()
            .then(function(t) {
                    var dataAppt = Services.GetDataAppointment.AppointmentCreate(data);
                    dataAppt.UID = UUIDService.Create();
                    apptUID = dataAppt.UID;
                    if (!_.isEmpty(userInfo)) {
                        dataAppt.CreatedBy = userInfo.ID;
                    }
                    var objectCreateAppt = {
                        data: dataAppt,
                        transaction: t
                    };
                    return Services.CreateAppointment(objectCreateAppt)
                        .then(function(apptCreated) {
                            if (!_.isEmpty(apptCreated) &&
                                !_.isEmpty(data.PatientAppointment)) {
                                appointmentObject = apptCreated;
                                var dataPatientAppt = data.PatientAppointment;
                                if (_.isString(dataPatientAppt)) {
                                    dataPatientAppt = JSON.parse(dataPatientAppt);
                                }
                                dataPatientAppt.UID = UUIDService.Create();
                                if (!_.isEmpty(userInfo)) {
                                    dataPatientAppt.CreatedBy = userInfo.ID;
                                }
                                return appointmentObject.createPatientAppointment(dataPatientAppt, {
                                    transaction: t
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(patientAppointmentCreated) {
                            if (!_.isEmpty(data.FileUploads) &&
                                !_.isEmpty(appointmentObject)) {
                                if (_.isString(data.FileUploads)) {
                                    data.FileUploads = JSON.parse(data.FileUploads);
                                }
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
                                    transaction: t,
                                    raw: true
                                });
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
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
                            if (!_.isEmpty(data.Doctor) &&
                                !_.isEmpty(appointmentObject)) {
                                if (_.isString(data.Doctor)) {
                                    data.Doctor = JSON.parse(data.Doctor);
                                }
                                var objRelDoctorAppt = {
                                    appointmentObject: appointmentObject,
                                    where: data.Doctor.UID,
                                    transaction: t
                                };
                                return Services.RelDoctorAppointment(objRelDoctorAppt);
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(relDoctorApptCreated) {
                            if (!_.isEmpty(data.DoctorGroups) &&
                                !_.isEmpty(appointmentObject)) {
                                if (_.isString(data.DoctorGroups)) {
                                    data.DoctorGroups = JSON.parse(data.DoctorGroups);
                                }
                                var objectRelAppointmentDoctorGroup = {
                                    where: data.DoctorGroups,
                                    transaction: t,
                                    appointmentObject: appointmentObject
                                };
                                return Services.RelAppointmentDoctorGroup(objectRelAppointmentDoctorGroup);
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(relAppointmentDoctorGroupCreated) {
                            if (!_.isEmpty(data.AppointmentData)) {
                                if (_.isString(data.AppointmentData)) {
                                    data.AppointmentData = JSON.parse(data.AppointmentData);
                                }
                                if (_.isArray(data.AppointmentData)) {
                                    _.forEach(data.AppointmentData, function(valueApptData, indexApptData) {
                                        data.AppointmentData[indexApptData].AppointmentID =
                                            (!_.isEmpty(appointmentObject) &&
                                                !_.isEmpty(appointmentObject.dataValues)) ?
                                            appointmentObject.dataValues.ID : null;
                                        data.AppointmentData[indexApptData].UID = UUIDService.Create();
                                        data.AppointmentData[indexApptData].CreatedBy = (!_.isEmpty(userInfo)) ? userInfo.ID : null;
                                    });
                                    var objCreateAppointmentData = {
                                        data: data.AppointmentData,
                                        transaction: t
                                    };
                                    return Services.CreateAppointmentData(objCreateAppointmentData);
                                }
                            }
                        }, function(err) {
                            defer.reject({
                                error: err,
                                transaction: t
                            });
                        })
                        .then(function(apptDataCreated) {
                            var code = null;
                            if (!_.isEmpty(appointmentObject) &&
                                !_.isEmpty(appointmentObject.dataValues) &&
                                HelperService.CheckExistData(appointmentObject.dataValues.ID)) {
                                code = HashIDService.Create(appointmentObject.dataValues.ID)
                            }
                            defer.resolve({
                                status: 'success',
                                transaction: t,
                                code: code,
                                apptUID: apptUID
                            });
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
