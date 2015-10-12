module.exports = {
    'post /api/appointment-telehealth-request': {
        controller: 'Appointment/AppointmentController',
        action: 'RequestAppointment'
    },

    'post /api/appointment-telehealth-list': {
        controller: 'Appointment/AppointmentController',
        action: 'GetListTelehealthAppointment'
    },

    'get /api/appointment-telehealth-detail/:UID': {
        controller: 'Appointment/AppointmentController',
        action: 'GetDetailTelehealthAppointment'
    },
    'post /api/appointment-telehealth-update': {
        controller: 'Appointment/AppointmentController',
        action: 'UpdateTelehealthAppointment'
    },
    'post /api/appointment-telehealth-delete': {
        controller: 'Appointment/AppointmentController',
        action: 'DeleteTelehealthAppointment'
    }
};
