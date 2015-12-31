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
	                        if (HelperService.CheckExistData(objAppt) &&
	                            HelperService.CheckExistData(data.Consultations) &&
	                            !_.isEmpty(data.Consultations) &&
	                            _.isArray(data.Consultations)) {
	                            appointmentObject = objAppt;
	                            var consultNotes = Services.GetDataConsultation.ConsultNote(data.Consultations, userInfo.ID);
	                            var objectCreateConsultNotes = {
	                                data: consultNotes,
	                                transaction: t
	                            };
	                            return Services.BulkCreateConsultNote(objectCreateConsultNotes);
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
	                    .then(function(relAppointmentConsultNoteCreated) {
	                        console.log('relAppointmentConsultNoteCreated', relAppointmentConsultNoteCreated);
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
