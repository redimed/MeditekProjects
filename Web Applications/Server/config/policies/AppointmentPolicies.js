module.exports = {
    'Appointment/AppointmentController': {
        'RequestAppointment': ['isAuthenticated'],
        'GetListTelehealthAppointment': ['isAuthenticated'],
        'GetDetailTelehealthAppointment': ['isAuthenticated'],
        'UpdateTelehealthAppointment': ['isAuthenticated'],
        'DeleteTelehealthAppointment': ['isAuthenticated']
    }
};
