module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Appointment) &&
        !_.isEmpty(data.Site) &&
        !_.isEmpty(data.Service) &&
        !_.isEmpty(data.Doctor) &&
        !_.isEmpty(data.Patient)) {
        var objAppt = null;
        sequelize.transaction()
            .then(function(t) {
                var whereClauseSite = {};
                _.forEach(data.Site, function(valueKey, indexKey) {
                    if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                        moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                        whereClauseSite[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                    } else if (!_.isArray(valueKey) &&
                        !_.isObject(valueKey)) {
                        whereClauseSite[indexKey] = valueKey;
                    }
                });
                return Site.findOne({
                        attributes: ['ID'],
                        where: whereClauseSite,
                        transaction: t,
                        raw: true
                    })
                    .then(function(siteRes) {
                        if (!_.isEmpty(siteRes)) {
                            var dataAppt = {
                                UID: UUIDService.Create(),
                                FromTime: data.Appointment.FromTime,
                                ToTime: data.Appointment.ToTime,
                                RequestDate: data.Appointment.RequestDate,
                                Type: data.Appointment.Type,
                                Enable: 'Y',
                                SiteID: siteRes.ID,
                                CreatedBy: userInfo.ID
                            };
                            return Appointment.create(dataAppt, {
                                transaction: t
                            });
                        } else {
                            var error = new Error('UpdateRequestBooking.data(Site).not.exist');
                            defer.reject({
                                error: error,
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(apptCreated) {
                        if (!_.isEmpty(apptCreated)) {
                            objAppt = apptCreated;
                            var whereClauseDoctor = {};
                            _.forEach(data.Doctor, function(valueKey, indexKey) {
                                if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                    moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                    whereClauseDoctor[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                } else if (!_.isArray(valueKey) &&
                                    !_.isObject(valueKey)) {
                                    whereClauseDoctor[indexKey] = valueKey;
                                }
                            });
                            return Doctor.findOne({
                                attributes: ['ID'],
                                where: whereClauseDoctor,
                                transaction: t,
                                raw: true
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(doctorRes) {
                        if (!_.isEmpty(doctorRes)) {
                            return objAppt.addDoctor(doctorRes.ID, {
                                transaction: t,
                                raw: true
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(relApptDoctorCreated) {
                        var whereClauseService = {};
                        _.forEach(data.Service, function(valueKey, indexKey) {
                            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                whereClauseService[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                            } else if (!_.isArray(valueKey) &&
                                !_.isObject(valueKey)) {
                                whereClauseService[indexKey] = valueKey;
                            }
                        });
                        return Service.findOne({
                            attributes: ['ID'],
                            where: whereClauseService,
                            transaction: t,
                            raw: true
                        });
                    }, function(err) {
                        defer.reject({
                            transaction: t,
                            error: err
                        });
                    })
                    .then(function(serviceRes) {
                        if (!_.isEmpty(serviceRes)) {
                            return objAppt.addService(serviceRes.ID, {
                                transaction: t,
                                raw: true
                            });
                        } else {
                            var error = new Error('UpdateRequestBooking.data(Service).not.exist');
                            defer.reject({
                                error: error,
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(relApptServiceCreated) {
                        var whereClausePatient = {};
                        _.forEach(data.Patient, function(valueKey, indexKey) {
                            if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
                                moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                whereClausePatient[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                            } else if (!_.isArray(valueKey) &&
                                !_.isObject(valueKey)) {
                                whereClausePatient[indexKey] = valueKey;
                            }
                        });
                        return Patient.findOne({
                            attributes: ['ID'],
                            where: whereClausePatient,
                            transaction: t,
                            raw: true
                        });
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(patientRes) {
                        if (!_.isEmpty(patientRes)) {
                            return objAppt.addPatient(patientRes.ID, {
                                transaction: t
                            });
                        } else {
                            var error = new Error('UpdateRequestBooking.data(Patient).not.exist');
                            defer.reject({
                                error: error,
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(relApptPatientCreated) {
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
            }, function(err) {
                defer.reject(err);
            });
    } else {
        var error = new Error('UpdateBooking.data(Appointment).not.exist');
        defer.reject(error);
    }
    return defer.promise;
};
