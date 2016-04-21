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
        'RequestAppointmentMedicalBooking': ['isIp']
    }
};
