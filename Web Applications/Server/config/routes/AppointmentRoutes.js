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
        action: 'UpdateRequestTelehealthAppointment'
    },
    'post /api/appointment-telehealth-disable': {
        controller: 'Appointment/AppointmentController',
        action: 'DisableTelehealthAppointment'
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
    'post /api/appointment-wa-disable': {
        controller: 'Appointment/AppointmentController',
        action: 'DisableWAAppointment'
    },
};
