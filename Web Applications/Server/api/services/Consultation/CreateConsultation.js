	var $q = require('q');
	module.exports = function(data, userInfo) {
	    var defer = $q.defer();
	    var appointmentObject = null;
	    var consultNoteObject = null;
	    return sequelize.transaction()
	        .then(function(t) {
	            if (HelperService.CheckExistData(data) &&
	                HelperService.CheckExistData(userInfo)) {
	                var AppointmentUID = data.UID;
	                Appointment.findOne({
	                        attrbutes: ['ID'],
	                        where: data.Appointment,
	                        transaction: t
	                    })
	                    .then(function(objAppt) {
	                        if (HelperService.CheckExistData(objAppt)) {
	                            appointmentObject = objAppt;
	                            var objectCreateConsultNote = {
	                                data: {
	                                    UID: UUIDService.Create(),
	                                    CreatedBy: userInfo.ID
	                                },
	                                transaction: t
	                            };
	                            return Services.CreateConsultNote(objectCreateConsultNote);
	                        } else {
	                            defer.reject({
	                                error: new Error('CreateConsultation.Appointment.not.found'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(consultNoteCreated) {
	                        if (HelperService.CheckExistData(consultNoteCreated) &&
	                            HelperService.CheckExistData(appointmentObject)) {
	                            consultNoteObject = consultNoteCreated;
	                            var consultNoteID = JSON.parse(JSON.stringify(consultNoteCreated)).ID;
	                            var objectRelApptConsultNote = {
	                                data: [consultNoteID],
	                                transaction: t,
	                                appointmentObject: appointmentObject
	                            };
	                            return Services.RelAppointmentConsultNote(objectRelApptConsultNote);
	                        } else {
	                            defer.reject({
	                                error: new Error('CreateConsultNote.failed'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(relAppointmentConsultNoteCreate) {
	                        if (HelperService.CheckExistData(data.Consultations)) {
	                            var consultationData =
	                                Services.GetDataConsultation.ConsultationData(data.Consultations, userInfo.ID);
	                            var objectCreateConsultationData = {
	                                data: consultationData,
	                                transaction: t
	                            };
	                            return Services.BulkCreateConsultationData(objectCreateConsultationData);
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(consultationDataCreated) {
	                        var consultationDataCreated =
	                            JSON.parse(JSON.stringify(consultationDataCreated));
	                        var arrayConsultDataUnique = _.map(_.groupBy(consultationDataCreated, function(CD) {
	                            return CD.ID;
	                        }), function(subGrouped) {
	                            return subGrouped[0].ID;
	                        });
	                        var objRelConsultData = {
	                            data: arrayConsultDataUnique,
	                            transaction: t,
	                            consultNoteObject: consultNoteObject
	                        };
	                        return Services.RelConsultationData(objRelConsultData);
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(relConsultDataCreated) {
	                        defer.resolve({
	                            transaction: t
	                        });
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    });
	            } else {
	                defer.reject({
	                    error: new Error('CreateConsultation.data.failed'),
	                    transaction: t
	                });
	            }
	            return defer.promise;
	        });
	};
