module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    var pagination = Services.GetPaginationAppointment(data, userInfo);
    //get limit, offset
    Appointment.findAndCountAll({
            attributes: ['UID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status', 'Enable'],
            include: [{
                model: TelehealthAppointment,
                attributes: ['UID', 'RefName', 'RefDate', 'Correspondence'],
                required: (HelperService.CheckExistData(pagination.filterPatientAppointment) && !_.isEmpty(pagination.filterPatientAppointment)),
                include: [{
                    model: PatientAppointment,
                    attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'WorkPhoneNumber'],
                    required: (HelperService.CheckExistData(pagination.filterPatientAppointment) && !_.isEmpty(pagination.filterPatientAppointment)),
                    where: pagination.filterPatientAppointment
                }],
                where: pagination.filterTelehealthAppointment
            }, {
                model: Doctor,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB', 'Email', 'HomePhoneNumber', 'WorkPhoneNumber'],
                required: (HelperService.CheckExistData(pagination.filterDoctor) && !_.isEmpty(pagination.filterDoctor)),
                where: pagination.filterDoctor
            }, {
                model: Patient,
                attributes: ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB'],
                required: (HelperService.CheckExistData(pagination.filterPatient) && !_.isEmpty(pagination.filterPatient)),
                where: pagination.filterPatient,
                include: [{
                    model: UserAccount,
                    attributes: ['ID', 'UserName', 'Email', 'PhoneNumber', 'Activated'],
                    required: false
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
