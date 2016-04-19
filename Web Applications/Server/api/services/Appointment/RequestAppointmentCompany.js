module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('RequestAppointmentCompany');
    var appointmentObject = null;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Appointments) &&
        _.isArray(data.Appointments)) {
        sequelize.transaction()
            .then(function(t) {
                sequelize.Promise.each(data.Appointments, function(valueAppt, indexAppt) {
                        if (!_.isEmpty(valueAppt) &&
                            !_.isEmpty(valueAppt.PatientAppointment)) {
                        	var dataAppointment = Services.GetDataAppointment.AppointmentCreate(valueAppt);
                            dataAppointment.UID = UUIDService.Create();
                            if (!_.isEmpty(userInfo)) {
                                dataAppointment.CreatedBy = userInfo.ID;
                            }
                            var objCreateAppt = {
                                data: dataAppointment,
                                transaction: t
                            };
                            //create appointment
                            return Services.CreateAppointment(objCreateAppt)
                                .then(function(apptCreated) {
                                    if (!_.isEmpty(apptCreated)) {
                                        appointmentObject = apptCreated;
                                        var dataPatientAppt = valueAppt.PatientAppointment;
                                        dataPatientAppt.UID = UUIDService.Create();
                                        //create PatientAppointment
                                        return appointmentObject.createPatientAppointment(dataPatientAppt, {
                                            transaction: t
                                        });
                                    }
                                }, function(err) {
                                    error.pushError(err);
                                    defer.reject({
                                        error: error,
                                        transaction: t
                                    });
                                    throw error;
                                })
                                .then(function(patientApptCreated) {
                                    if (!_.isEmpty(valueAppt.AppointmentData) &&
                                        !_.isEmpty(appointmentObject) &&
                                        _.isArray(valueAppt.AppointmentData)) {
                                        _.forEach(valueAppt.AppointmentData, function(valueApptData, indexApptData) {
                                            valueAppt.AppointmentData[indexApptData].AppointmentID =
                                                (!_.isEmpty(appointmentObject) &&
                                                    !_.isEmpty(appointmentObject.dataValues)) ?
                                                appointmentObject.dataValues.ID : null;
                                            valueAppt.AppointmentData[indexApptData].UID = UUIDService.Create();
                                            valueAppt.AppointmentData[indexApptData].CreatedBy = (!_.isEmpty(userInfo)) ? userInfo.ID : null;
                                        });
                                        var objCreateAppointmentData = {
                                            data: valueAppt.AppointmentData,
                                            transaction: t
                                        };
                                        //create AppointmentData
                                        return Services.CreateAppointmentData(objCreateAppointmentData);
                                    }
                                }, function(err) {
                                    error.pushError(err);
                                    defer.reject({
                                        error: error,
                                        transaction: t
                                    });
                                    throw error;
                                })
                                .then(function(apptDataCreated) {
                                    if (!_.isEmpty(valueAppt.Patients) &&
                                        !_.isEmpty(appointmentObject)) {
                                        var objRelApptPatient = {
                                            where: valueAppt.Patients,
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
                                .then(function(relapptPatientCreated) {
                                    if (!_.isEmpty(valueAppt.Doctors) &&
                                        !_.isEmpty(appointmentObject)) {
                                        var objRelApptDoctor = {
                                            where: valueAppt.Doctors,
                                            appointmentObject: appointmentObject,
                                            transaction: t
                                        };
                                        return Services.RelAppointmentDoctor(objRelApptDoctor);
                                    }
                                }, function(err) {
                                    error.pushError(err);
                                    defer.reject({
                                        error: error,
                                        transaction: t
                                    });
                                    throw error;
                                })
                                .then(function(relApptDoctorCreated) {
                                    if (!_.isEmpty(valueAppt.FileUploads) &&
                                        _.isArray(valueAppt.FileUploads) &&
                                        !_.isEmpty(appointmentObject)) {
                                        var arrayFileUploadsUnique = _.map(_.groupBy(valueAppt.FileUploads, function(FU) {
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
                                    defer.reject({
                                        error: error,
                                        transaction: t
                                    });
                                    throw error;
                                });
                        } else {
                            error.pushError('data.isEmpty');
                            throw error;
                        }
                    })
                    .then(function(appointmentCreated) {
                        defer.resolve({
                            status: 'success',
                            transaction: t
                        });
                    }, function(err) {
                        error.pushError(err);
                        defer.reject({
                            error: error,
                            transaction: t
                        });
                        throw error;
                    })
                    .then(function(arrayAppointmentCreated) {
                        defer.resolve({
                            status: 'success',
                            transaction: t
                        });
                    }, function(err) {
                        error.pushError(err);
                        defer.reject({
                            error: error,
                            transaction: t
                        });
                        throw error;
                    });
            }, function(err) {
                error.pushError(err);
                defer.reject({ error: error });
                throw error;
            });
    } else {
        error.pushErrorError('array.data.isEmpty');
        defer.reject({ error: error });
        throw error;
    }
    return defer.promise;
}
