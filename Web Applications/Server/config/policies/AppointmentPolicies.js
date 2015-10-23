module.exports = {
    'Appointment/AppointmentController': {
        'RequestAppointment': ['hasToken'],
        'GetListTelehealthAppointment': ['hasToken'],
        'GetDetailTelehealthAppointment': ['hasToken'],
        'UpdateTelehealthAppointment': ['hasToken'],
        'DeleteTelehealthAppointment': ['hasToken']
    }
};
