module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = Services.GetPaginationAppointment(data);
    //get limit, offset
    Appointment.findAll({
            attributes: ['UID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status', 'Enable'],
            include: [{
                model: TelehealthAppointment,
                attributes: ['UID', 'RefName', 'RefDate'],
                required: true,
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'PhoneNumber'],
                    required: true,
                    where: pagination.filterPatientAppointment,
                    order: pagination.orderPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment,
                order: pagination.orderTelehealthAppointment
            }, {
                model: Doctor,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'PhoneNumber'],
                required: true,
                where: pagination.filterDoctor,
                order: pagination.orderDoctor
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB'],
                required: true,
                where: pagination.filterPatient,
                order: pagination.orderPatient,
                include: [{
                    model: UserAccount,
                    attributes: ['ID', 'UserName', 'Email', 'PhoneNumber', 'Activated'],
                    required: true
                }]
            }],
            where: pagination.filterAppointment,
            order: pagination.orderAppointment,
            limit: pagination.limit,
            offset: pagination.offset,
        })
        .then(function(apptTelehealth) {
            defer.resolve({
                data: apptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
