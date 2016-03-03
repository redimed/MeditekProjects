	var $q = require('q');
	var moment = require('moment');
	module.exports = function(data, userInfo) {
	    var defer = $q.defer();
	    var appointmentObject = null;
	    var consultationObject = null;
	    sequelize.transaction()
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
	                return Appointment.findOne({
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
	                            var consultations = Services.GetDataConsultation.Consultation(data.Consultations, userInfo.ID);
	                            var objectCreateConsultations = {
	                                data: consultations,
	                                transaction: t
	                            };
	                            return Services.BulkCreateConsultation(objectCreateConsultations);
	                        } else {
	                            defer.reject({
	                                error: new Error('CreateConsultation.Appointment(Consultations).not.found'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(consultationCreatedRes) {
	                        if (HelperService.CheckExistData(consultationCreatedRes) &&
	                            HelperService.CheckExistData(appointmentObject)) {
	                            consultationObject = consultationCreatedRes;
	                            var consultationCreated =
	                                JSON.parse(JSON.stringify(consultationCreatedRes));
	                            var arrayConsultationIDUnique = _.map(_.groupBy(consultationCreated, function(CN) {
	                                return CN.ID;
	                            }), function(subGrouped) {
	                                return subGrouped[0].ID;
	                            });
	                            var objectRelApptConsultation = {
	                                data: arrayConsultationIDUnique,
	                                transaction: t,
	                                appointmentObject: appointmentObject
	                            };
	                            return Services.RelAppointmentConsultation(objectRelApptConsultation);
	                        } else {
	                            defer.reject({
	                                error: new Error('CreateConsultation.failed'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(relAppointmentConsultationCreated) {
	                        defer.resolve({
	                            transaction: t,
	                            status: 'success',
	                            data: consultationObject
	                        });
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    });
	            } else {
	                defer.reject({
	                    error: new Error('RequestConsultation.data.failed'),
	                    transaction: t
	                });
	            }
	        }, function(err) {
	            defer.reject(err);
	        });
	    return defer.promise;
	};
