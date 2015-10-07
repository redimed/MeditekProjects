module.exports = function(teleAppointmentUID) {
    var $q = require('q');
    var defer = $q.defer();
    Appointment.findOne({
            attributes: ['UID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status', 'Enable'],
            include: [{
                model: TelehealthAppointment,
                attributes: ['ID', 'RefName', 'RefDate'],
                required: true,
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'PhoneNumber'],
                    required: true,
                }]
            }, {
                model: Doctor,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'Phone'],
                required: true
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB'],
                required: true,
                include: [{
                    model: UserAccount,
                    attributes: ['UserName', 'Email', 'PhoneNumber', 'Activated'],
                    required: true
                }]
            }],
            where: {
                UID: teleAppointmentUID
            }
        })
        .then(function(detailApptTelehealth) {
            defer.resolve({
                data: detailApptTelehealth
            });
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
