module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var telehealthApointmentCreated;
    var preferringPractitioner;
    var appointmentCreated;
    var teleApptID;
    return sequelize.transaction()
        .then(function(t) {
            if (HelperService.CheckExistData(userInfo) &&
                HelperService.CheckExistData(userInfo.UID)) {
                //find information PreferringPractitioner
                var objectFindPreferringPractitioner = {
                    UID: userInfo.UID,
                    transaction: t
                };
                Services.GetPreferringPractictioner(objectFindPreferringPractitioner)
                    .then(function(infoPreferringPractitioner) {
                        if (HelperService.CheckExistData(infoPreferringPractitioner) &&
                            HelperService.CheckExistData(infoPreferringPractitioner.Doctor)) {
                            preferringPractitioner = infoPreferringPractitioner.Doctor;
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
                                /*
                                create association Appointment with FileUpload 
                                via RelAppointmentFileUpload
                                */
                                var arrayFileUploadsUnique = _.map(_.groupBy(data.FileUploads, function(FU) {
                                    return FU.UID;
                                }), function(subGrouped) {
                                    return subGrouped[0].UID;
                                });
                                var objectFindFileUpload = {
                                    data: arrayFileUploadsUnique,
                                    transaction: t
                                };
                                //Rel Appointment with FileUpload
                                return Services.FindIDFileUpload(objectFindFileUpload);
                            }
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(arrayIDFileUpload) {
                        if (HelperService.CheckExistData(arrayIDFileUpload) &&
                            _.isArray(arrayIDFileUpload) &&
                            HelperService.CheckExistData(appointmentCreated)) {
                            var objectAddFileUpload = {
                                data: arrayIDFileUpload,
                                transaction: t,
                                appointmentCreated: appointmentCreated
                            };
                            return Services.RelAppointmentFileUpload(objectAddFileUpload);
                        }
                    }, function(err) {
                        defer.reject({
                            transaction, t,
                            error: err
                        });
                    })
                    .then(function(RelAppointmentFileUploadAdded) {
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
                            var objectCreatedTelehealthAppointment = {
                            	data: dataTelehealthAppointment,
                            	transaction: t,
                            	appointmentCreated, appointmentCreated
                            };
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
            } else {
                defer.reject({
                    transaction: t,
                    error: err
                });
            }
        }, function(err) {
            defer.reject({
                error: err
            });
            return defer.promise;
        });
};
