module.exports = {
    'Appointment/TelehealthAppointmentController': {
        'RequestTelehealthAppointment': ['isAuthenticated'],
        'GetListTelehealthAppointment': ['isAuthenticated'],
        'GetDetailTelehealthAppointment': ['isAuthenticated'],
        'UpdateRequestTelehealthAppointment': ['isAuthenticated'],
        'DisableTelehealthAppointment': ['isAuthenticated']
    },
    'Appointment/WAAppointmentController': {
        'RequestWAAppointment': ['isAuthenticated'],
        'GetListWAAppointment': ['isAuthenticated'],
        'GetDetailWAAppointment': ['isAuthenticated'],
        'GetDetailWAAppointmentforEform': true,
        'UpdateRequestWAAppointment': ['isAuthenticated'],
        'DisableWAAppointment': ['isAuthenticated'],
        'RequestWAAppointmentPatient': true,
        'RequestAppointmentMedicalBooking': ['isIp'],
        'RequestWAAppointmentPatientNew': true,
        'LinkAppointmentDoctorOnlineBooking': ['isIp'],
        'LinkAppointmentPatientOnlineBooking': ['isIp'],
        'LinkAppointmentDoctor': ['isAuthenticated', function(req, res, next) {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isInternalPractitioner ||
                role.isAdmin ||
                role.isAssistant ||
                role.isOrganization) {
                return next();
            } else {
                var error = new Error("Policies.Error");
                error.pushError("Policies.permissionDenied");
                return res.unauthor(error);
            }
        }],
        'LinkAppointmentPatient': ['isAuthenticated', function(req, res, next) {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isInternalPractitioner ||
                role.isAdmin ||
                role.isAssistant ||
                role.isOrganization) {
                return next();
            } else {
                var error = new Error("Policies.Error");
                error.pushError("Policies.permissionDenied");
                return res.unauthor(error);
            }
        }],
    }
};
