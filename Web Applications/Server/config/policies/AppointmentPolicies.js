module.exports = {
    'Appointment/TelehealthAppointmentController': {
        'RequestTelehealthAppointment': ['hasToken'],
        'GetListTelehealthAppointment': ['hasToken'],
        'GetDetailTelehealthAppointment': ['hasToken'],
        'UpdateRequestTelehealthAppointment': ['hasToken'],
        'DisableTelehealthAppointment': ['hasToken']
    },
    'Appointment/WAAppointmentController': {
        'RequestWAAppointment': ['hasToken'],
        'GetListWAAppointment': ['hasToken'],
        'GetDetailWAAppointment': ['hasToken'],
        'UpdateRequestWAAppointment': ['hasToken'],
        'DisableWAAppointment': ['hasToken']
    }
};
