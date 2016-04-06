	var $q = require('q');
	var moment = require('moment');
	module.exports = function(data, userInfo) {
	    var defer = $q.defer();
	    var appointmentObject = null;
	    var admissionObject = null;
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
	                            HelperService.CheckExistData(data.Admissions) &&
	                            !_.isEmpty(data.Admissions) &&
	                            _.isArray(data.Admissions)) {
	                            appointmentObject = objAppt;
	                            var admissions = Services.GetDataAdmission.Admission(data.Admissions, userInfo.ID);
	                            var objectAdmission = {
	                                data: admissions,
	                                transaction: t
	                            };
	                            return Services.BulkCreateAdmission(objectAdmission);
	                        } else {
	                            defer.reject({
	                                error: new Error('CreateConsultation.Appointment(Admissions).not.found'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(admissionCreatedRes) {
	                        if (HelperService.CheckExistData(admissionCreatedRes) &&
	                            HelperService.CheckExistData(appointmentObject)) {
	                            admissionObject = admissionCreatedRes;
	                            var admissionCreated =
	                                JSON.parse(JSON.stringify(admissionCreatedRes));
	                            var arrayAdmissionIDUnique = _.map(_.groupBy(admissionCreated, function(PA) {
	                                return PA.ID;
	                            }), function(subGrouped) {
	                                return subGrouped[0].ID;
	                            });
	                            var objectRelAdmission = {
	                                data: arrayAdmissionIDUnique,
	                                transaction: t,
	                                appointmentObject: appointmentObject
	                            };
	                            return Services.RelAppointmentAdmission(objectRelAdmission);
	                        } else {
	                            defer.reject({
	                                error: new Error('BulkCreateAdmission.failed'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(relAppointmentAdmissionCreated) {
	                        var admissionResponse = [];
	                        _.forEach(admissionObject, function(value, index) {
	                            admissionResponse.push({ UID: value.UID });
	                        });
	                        defer.resolve({
	                            transaction: t,
	                            status: 'success',
	                            admissionResponse: admissionResponse
	                        });
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    });
	            } else {
	                defer.reject({
	                    error: new Error('CreateAdmission.data.failed'),
	                    transaction: t
	                });
	            }
	        }, function(err) {
	            defer.reject(err);
	        });
	    return defer.promise;
	};
