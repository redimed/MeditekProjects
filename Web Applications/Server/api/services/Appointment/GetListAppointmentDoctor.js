module.exports = function(data, userInfo, objRequired) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = PaginationService(data, Appointment);
    var arrayPromise = [];
    arrayPromise.push(Appointment.findAll({
        attributes: ['ID'],
        include: [{
            attributes: ['ID'],
            model: Doctor,
            required: true,
            where: {
                UserAccountID: userInfo.ID
            }
        }],
        raw: true
    }));
    arrayPromise.push(Appointment.findAll({
        attributes: ['ID'],
        where: {
            CreatedBy: userInfo.ID
        },
        raw: true
    }));
    $q.all(arrayPromise)
        .then(function(arrAppt) {
            var arrApptTreatingDoctor = _.map(arrAppt[0], 'ID');
            var arrApptCreatedBy = _.map(arrAppt[1], 'ID');
            var arrWhereClase = arrApptTreatingDoctor.concat(arrApptCreatedBy);
            arrWhereClase = _.uniq(arrWhereClase);
            if (!HelperService.CheckExistData(pagination.Appointment)) {
                pagination.Appointment = [];
            }
            pagination.Appointment.push({
                ID: {
                    $in: arrWhereClase
                }
            });
            return Appointment.findAndCountAll({
                attributes: Services.AttributesAppt.Appointment(),
                include: [{
                    model: TelehealthAppointment,
                    attributes: Services.AttributesAppt.TelehealthAppointment(),
                    required: !_.isEmpty(pagination.TelehealthAppointment),
                    where: pagination.TelehealthAppointment
                }, {
                    model: Doctor,
                    attributes: Services.AttributesAppt.Doctor(),
                    required: !_.isEmpty(pagination.Doctor),
                    where: pagination.Doctor
                }, {
                    model: Patient,
                    attributes: Services.AttributesAppt.Patient(),
                    required: ((!_.isEmpty(objRequired)) ? objRequired.Patient : false || !_.isEmpty(pagination.Patient)),
                    where: pagination.Patient,
                    include: [{
                        model: UserAccount,
                        attributes: Services.AttributesAppt.UserAccount(),
                        required: false
                    }, {
                        model: Company,
                        exclude: ['CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy'],
                        where: pagination.Company,
                        through: {
                            where: {
                                Active: 'Y'
                            }
                        },
                        required: !_.isEmpty(pagination.Company)
                    }]
                }, {
                    model: PatientAppointment,
                    attributes: Services.AttributesAppt.PatientAppointment(),
                    required: !_.isEmpty(pagination.PatientAppointment),
                    where: pagination.PatientAppointment
                }],
                where: pagination.Appointment,
                order: pagination.order,
                limit: pagination.limit,
                offset: pagination.offset,
                subQuery: false
            });
        }, function(err) {
            defer.reject(err);
        })
        .then(function(apptList) {
            defer.resolve(apptList);
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
