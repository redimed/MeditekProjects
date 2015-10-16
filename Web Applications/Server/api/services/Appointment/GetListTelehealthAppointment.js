module.exports = function(data) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = Services.GetPaginationAppointment(data);
    //get limit, offset
    Appointment.findAndCountAll({
            attributes: ['UID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status', 'Enable'],
            include: [{
                model: TelehealthAppointment,
                attributes: ['UID', 'RefName', 'RefDate', 'Correspondence'],
                required: true,
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'PhoneNumber'],
                    required: true,
                    where: pagination.filterPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment
            }, {
                model: Doctor,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'HomePhoneNumber', 'WorkPhoneNumber'],
                required: true,
                where: pagination.filterDoctor
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB'],
                required: true,
                where: pagination.filterPatient,
                include: [{
                    model: UserAccount,
                    attributes: ['ID', 'UserName', 'Email', 'PhoneNumber', 'Activated'],
                    required: true
                }]
            }],
            where: pagination.filterAppointment,
            order: pagination.order,
            limit: pagination.limit,
            offset: pagination.offset,
            subQuery: false
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
