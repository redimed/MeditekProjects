	var $q = require('q');
	var moment = require('moment');
	module.exports = function(data, userInfo) {
	    var defer = $q.defer();
	    var appointmentObject = null;
	    var consultNoteObject = null;
	    return sequelize.transaction()
	        .then(function(t) {
	            if (HelperService.CheckExistData(data) &&
	                HelperService.CheckExistData(userInfo)) {
	                var whereClause = {};
	                _.forEach(data, function(valueData, indexData) {
	                    if (HelperService.CheckExistData(valueData) &&
	                        !_.isObject(valueData) &&
	                        !_.isArray(valueData)) {
	                        if (moment(valueData, 'YYYY-MM-DD Z', true).isValid() ||
	                            moment(valueData, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
	                            whereClause[indexData] = moment(valueData, 'YYYY-MM-DD HH:mm:ss Z').toDate();
	                        } else {
	                            whereClause[indexData] = valueData;
	                        }
	                    }
	                });
	                Appointment.findOne({
	                        attrbutes: ['ID'],
	                        where: whereClause,
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
	                    .then(function(consultNoteCreatedRes) {
	                        if (HelperService.CheckExistData(consultNoteCreatedRes) &&
	                            HelperService.CheckExistData(appointmentObject)) {
	                            consultNoteObject = consultNoteCreatedRes;
	                            var consultNoteCreated =
	                                JSON.parse(JSON.stringify(consultNoteCreatedRes));
	                            var arrayConsultNoteIDUnique = _.map(_.groupBy(consultNoteCreated, function(CN) {
	                                return CN.ID;
	                            }), function(subGrouped) {
	                                return subGrouped[0].ID;
	                            });
	                            var objectRelApptConsultNote = {
	                                data: arrayConsultNoteIDUnique,
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
	                        defer.resolve({
	                            transaction: t,
	                            status: 'success'
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
