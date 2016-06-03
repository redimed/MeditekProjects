module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('UpdateRequestWAAppointmentCompany');
    var appointmentObject = null;
    if (!_.isEmpty(data)) {
        sequelize.transaction()
            .then(function(t) {
                var dataAppt = Services.GetDataAppointment.AppointmentUpdate(data);
                if (!_.isEmpty(userInfo)) {
                    dataAppt.ModifiedBy = userInfo.ID;
                }
                var objUpdateAppt = {
                    data: dataAppt,
                    transaction: t,
                    where: data.UID
                };
                return Services.UpdateAppointment(objUpdateAppt)
                    .then(function(apptUpdated) {
                        if (!_.isEmpty(apptUpdated) &&
                            !_.isEmpty(apptUpdated[1]) &&
                            !_.isEmpty(apptUpdated[1][0])) {
                            appointmentObject = apptUpdated[1][0];
                            if (!_.isEmpty(data.PatientAppointment)) {
                                var dataPatientAppt = Services.GetDataAppointment.PatientAppointmentUpdate(data.PatientAppointment);
                                if (!_.isEmpty(userInfo)) {
                                    dataPatientAppt.ModifiedBy = userInfo.ID;
                                }
                                var objUpdatePatientAppt = {
                                    data: dataPatientAppt,
                                    transaction: t,
                                    where: data.PatientAppointment.UID
                                };
                                return Services.UpdatePatientAppointment(objUpdatePatientAppt);
                            }
                        }
                    }, function(err) {
                        error.pushError(err);
                        defer.reject({ error: error, transaction: t });
                        throw error;
                    })
                    .then(function(patientApptUpdated) {
                        if (!_.isEmpty(data.AppointmentData) &&
                            _.isArray(data.AppointmentData) &&
                            !_.isEmpty(appointmentObject)) {
                            _.forEach(data.AppointmentData, function(valueApptData, indexApptData) {
                                data.AppointmentData[indexApptData].AppointmentID =
                                    (!_.isEmpty(appointmentObject) &&
                                        !_.isEmpty(appointmentObject.dataValues)) ?
                                    appointmentObject.dataValues.ID : null;
                                data.AppointmentData[indexApptData].UID = UUIDService.Create();
                                data.AppointmentData[indexApptData].CreatedBy = (!_.isEmpty(userInfo)) ? userInfo.ID : null;
                            });
                            var objUpdateApptData = {
                                data: data.AppointmentData,
                                transaction: t,
                                where: (!_.isEmpty(appointmentObject) &&
                                        !_.isEmpty(appointmentObject.dataValues)) ?
                                    appointmentObject.dataValues.ID : null
                            };
                            return Services.UpdateAppointmentData(objUpdateApptData);
                        }
                    }, function(err) {
                        error.pushError(err);
                        defer.reject({ error: error, transaction: t });
                        throw error;
                    })
                    .then(function(apptDataUpdated) {
                        if (!_.isEmpty(data.Patients) &&
                            _.isArray(data.Patients) &&
                            !_.isEmpty(appointmentObject)) {
                            var objRelApptPatient = {
                                where: data.Patients,
                                appointmentObject: appointmentObject,
                                transaction: t
                            };
                            return Services.RelAppointmentPatient(objRelApptPatient);
                        }
                    }, function(err) {
                        error.pushError(err);
                        defer.reject({
                            error: error,
                            transaction: t
                        });
                        throw error;
                    })
                    .then(function(relApptPatientUpdated) {
                        if (!_.isEmpty(data.Doctors) &&
                            _.isArray(data.Doctors) &&
                            !_.isEmpty(appointmentObject)) {
                            var objRelApptDoctor = {
                                where: data.Doctors,
                                appointmentObject: appointmentObject,
                                transaction: t
                            };
                            return Services.RelAppointmentDoctor(objRelApptDoctor);
                        }
                    }, function(err) {
                        error.pushError(err);
                        defer.reject({ error: error, transaction: t });
                        throw error;
                    })
                    .then(function(relApptDoctorCreated) {
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
                        error.pushError(err);
                        defer.reject({ error: error, transaction: t });
                        throw error;
                    })
                    .then(function(relApptFileUploadUpdated) {
                        defer.resolve({
                            status: 'success',
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject({
                            error: error,
                            transaction: t
                        });
                        throw error;
                    })
            }, function(err) {
                error.pushError(err);
                defer.reject({ error: error });
                throw error;
            });
    } else {
        error.pushError('data.isEmpty');
        defer.reject({ error: error });
        throw error;
    }
    return defer.promise;
};
