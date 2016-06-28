module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var error = new Error('RequestAppointmentCompany');
    var appointmentObject = null;
    var dataResponse = [];
    if (!_.isEmpty(data) &&
        (!_.isEmpty(data.Appointments) &&
        _.isArray(data.Appointments)) ||
        _.isString(data.Appointments)) {
        sequelize.transaction()
            .then(function(t) {
                if(_.isString(data.Appointments)) {
                    data.Appointments = JSON.parse(data.Appointments)
                 }
                    sequelize.Promise.each(data.Appointments, function(valueAppt, indexAppt) {
                            if (!_.isEmpty(valueAppt)) {
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
                                        appointmentObject = apptCreated;
                                        if (!_.isEmpty(apptCreated) &&
                                            (!_.isEmpty(valueAppt.PatientAppointment) ||
                                             _.isString(valueAppt.PatientAppointment))) {
                                            if(_.isString(valueAppt.PatientAppointment)) {
                                                valueAppt.PatientAppointment = JSON.parse(valueAppt.PatientAppointment)
                                            }
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
                                            //add data response
                                            var apptRes = {};
                                            if (!_.isEmpty(appointmentObject) &&
                                                !_.isEmpty(appointmentObject.dataValues)) {
                                                apptRes = {
                                                    ID: appointmentObject.dataValues.ID,
                                                    UID: appointmentObject.dataValues.UID,
                                                    Code: HashIDService.Create(appointmentObject.dataValues.ID)
                                                };
                                            }
                                            dataResponse.push({
                                                appointment: apptRes
                                            });
                                            if ((!_.isEmpty(valueAppt.AppointmentData) &&
                                                !_.isEmpty(appointmentObject) &&
                                                _.isArray(valueAppt.AppointmentData)) ||
                                                _.isString(valueAppt.AppointmentData)) {
                                                if(_.isString(valueAppt.AppointmentData)) {
                                                    valueAppt.AppointmentData = JSON.parse(valueAppt.AppointmentData)
                                                }
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
                                        },
                                        function(err) {
                                            error.pushError(err);
                                            defer.reject({
                                                error: error,
                                                transaction: t
                                            });
                                            throw error;
                                        })
                                    .then(function(apptDataCreated) {
                                        if ((!_.isEmpty(valueAppt.Patients) || 
                                            _.isString(valueAppt.Patients)) &&
                                            !_.isEmpty(appointmentObject)) {
                                            if(_.isString(valueAppt.Patients)) {
                                                valueAppt.Patients = JSON.parse(valueAppt.Patients)
                                            }
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
                                        if ((!_.isEmpty(valueAppt.Doctors) ||
                                            _.isString(valueAppt.Doctors)) &&
                                            !_.isEmpty(appointmentObject)) {
                                            if(_.isString(valueAppt.Doctors)) {
                                                valueAppt.Doctors = JSON.parse(valueAppt.Doctors)
                                            }
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
                                        if (((!_.isEmpty(valueAppt.FileUploads) &&
                                            _.isArray(valueAppt.FileUploads)) ||
                                            _.isString(valueAppt.FileUploads)) &&
                                            !_.isEmpty(appointmentObject)) {
                                            if(_.isString(valueAppt.FileUploads)) {
                                                valueAppt.FileUploads = JSON.parse(valueAppt.FileUploads)
                                            }
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
                                transaction: t,
                                data: dataResponse
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
                },
                function(err) {
                    error.pushError(err);
                    defer.reject({ error: error });
                    throw error;
                });
    } else {
        error.pushError('array.data.isEmpty');
        defer.reject({ error: error });
        throw error;
    }
    return defer.promise;
}
