module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = Services.GetPaginationAppointment(data);
    //get limit, offset
    Appointment.findAll({
            attributes: ['ID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status', 'Enable'],
            include: [{
                model: TelehealthAppointment,
                attributes: ['ID', 'RefName', 'RefDate'],
                required: true,
                include: [{
                    model: PatientAppointment,
                    attributes: ['ID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'PhoneNumber'],
                    required: true,
                    where: pagination.filterPatientAppointment,
                    order: pagination.orderPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment,
                order: pagination.orderTelehealthAppointment
            }, {
                model: Doctor,
                attributes: ['ID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'Phone'],
                required: true,
                where: pagination.filterDoctor,
                order: pagination.orderDoctor
            }, {
                model: Patient,
                attributes: ['ID', 'FirstName', 'MiddleName', 'LastName', 'DOB'],
                required: true,
                where: pagination.filterPatient,
                order: pagination.orderPatient,
                include: [{
                    model: UserAccount,
                    attributes: ['UserName', 'Email', 'PhoneNumber', 'Activated'],
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
                result: apptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
