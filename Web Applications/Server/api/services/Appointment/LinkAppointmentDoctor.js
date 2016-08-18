module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var apptObject = null;
    var moment = require('moment');
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Appointment) &&
        !_.isEmpty(data.Doctors) &&
        _.isArray(data.Doctors)) {
        var whereClauseAppt = {};
        _.forEach(data.Appointment, function(appt_val, appt_key) {
            if (moment(appt_val, 'YYYY-MM-DD Z', true).isValid() ||
                moment(appt_val, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                whereClauseAppt[appt_key] = moment(appt_val, 'YYYY-MM-DD HH:mm:ss Z').toDate();
            } else {
                whereClauseAppt[appt_key] = appt_val;
            }
        });
        sequelize.transaction({ autocommit: false })
            .then(function(t) {
                Appointment.findOne({
                        attributes: ['ID'],
                        where: whereClauseAppt,
                        transaction: t
                    })
                    .then(function(apptRes) {
                        if (!_.isEmpty(apptRes)) {
                            apptObject = apptRes;
                            var whereClauseDoctors = [];
                            _.forEach(data.Doctors, function(doctor, index) {
                                _.forEach(doctor, function(doctor_val, doctor_key) {
                                    if (!whereClauseDoctors[index]) {
                                        whereClauseDoctors[index] = {};
                                    }
                                    if (moment(doctor_val, 'YYYY-MM-DD Z', true).isValid() ||
                                        moment(doctor_val, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                        whereClauseDoctors[index][doctor_key] = moment(doctor_val, 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                    } else {
                                        whereClauseDoctors[index][doctor_key] = doctor_val;
                                    }
                                });
                            });
                            return Doctor.findAll({
                                attributes: ['ID'],
                                where: {
                                    $or: whereClauseDoctors
                                },
                                raw: true,
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                error: new Error('Appointment.not.found'),
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({ error: err, transaction: t });
                    })
                    .then(function(doctorsRes) {
                        doctorsRes = _.map(doctorsRes, 'ID');
                        if (!_.isEmpty(doctorsRes) &&
                            !_.isEmpty(apptObject)) {
                            return apptObject.setDoctors(doctorsRes, {
                                transaction: t
                            });
                        } else {
                            defer.reject({
                                error: new Error('Doctors.not.found'),
                                transaction: t
                            });
                        }
                    }, function(err) {
                        defer.reject({ error: err, transaction: t });
                    })
                    .then(function(relCreated) {
                        defer.resolve({ status: 'success', transaction: t });
                    }, function(err) {
                        defer.reject({ error: err, transaction: t });
                    })
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        defer.reject({ error: 'data.isEmpty' });
    }
    return defer.promise;
};
