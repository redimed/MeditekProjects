module.exports = {
    'post /api/appointment-telehealth-request': {
        controller: 'Appointment/AppointmentController',
        action: 'RequestTelehealthAppointment'
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
    },
    'post /api/appointment-wa-request': {
        controller: 'Appointment/AppointmentController',
        action: 'RequestWAAppointment'
    },

    'post /api/appointment-wa-list': {
        controller: 'Appointment/AppointmentController',
        action: 'GetListWAAppointment'
    },

    'get /api/appointment-wa-detail/:UID': {
        controller: 'Appointment/AppointmentController',
        action: 'GetDetailWAAppointment'
    },
    'post /api/appointment-wa-update': {
        controller: 'Appointment/AppointmentController',
        action: 'UpdateWAAppointment'
    },
    'post /api/appointment-wa-delete': {
        controller: 'Appointment/AppointmentController',
        action: 'DeleteWAAppointment'
    },
};
