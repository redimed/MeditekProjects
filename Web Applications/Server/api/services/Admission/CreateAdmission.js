	var $q = require('q');
	var moment = require('moment');
	module.exports = function(data, userInfo) {
	    var defer = $q.defer();
	    var appointmentObject = null;
	    var patientAdmissionObject = null;
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
	                            HelperService.CheckExistData(data.Admissions) &&
	                            !_.isEmpty(data.Admissions) &&
	                            _.isArray(data.Admissions)) {
	                            appointmentObject = objAppt;
	                            var patientAdmissions = Services.GetDataConsultation.PatienAdmission(data.Admissions, userInfo.ID);
	                            var objectPatientAdmission = {
	                                data: consultNotes,
	                                transaction: t
	                            };
	                            return Services.BulkCreatePatientAdmission(objectPatientAdmission);
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
	                    .then(function(patientAdmissionCreatedRes) {
	                        if (HelperService.CheckExistData(patientAdmissionCreatedRes) &&
	                            HelperService.CheckExistData(appointmentObject)) {
	                            patientAdmissionObject = patientAdmissionCreatedRes;
	                            var patientAdmissionCreated =
	                                JSON.parse(JSON.stringify(patientAdmissionCreatedRes));
	                            var arrayPatientAdmissionIDUnique = _.map(_.groupBy(patientAdmissionCreated, function(PA) {
	                                return PA.ID;
	                            }), function(subGrouped) {
	                                return subGrouped[0].ID;
	                            });
	                            var objectRelPatientAdmission = {
	                                data: arrayPatientAdmissionIDUnique,
	                                transaction: t,
	                                appointmentObject: appointmentObject
	                            };
	                            return Services.RelAppointmentPatientAdmission(objectRelPatientAdmission);
	                        } else {
	                            defer.reject({
	                                error: new Error('BulkCreatePatientAdmission.failed'),
	                                transaction: t
	                            });
	                        }
	                    }, function(err) {
	                        defer.reject({
	                            error: err,
	                            transaction: t
	                        });
	                    })
	                    .then(function(relAppointmentPatientAdmissionCreated) {
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
	                    error: new Error('CreateAdmission.data.failed'),
	                    transaction: t
	                });
	            }
	            return defer.promise;
	        });
	};
