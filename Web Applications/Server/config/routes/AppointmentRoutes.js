module.exports = {
    'post /api/appointment-telehealth-request': {
        controller: 'Appointment/AppointmentController',
        action: 'RequestAppointment'
    },

    'post /api/appointment-telehealth-list': {
        controller: 'Appointment/AppointmentController',
        action: 'GetListTelehealthAppointment'
    }
};
