module.exports = {
    'post /api/appointment-telehealth-request': {
        controller: 'Appointment/TelehealthAppointmentController',
        action: 'RequestTelehealthAppointment'
    },

    'post /api/appointment-telehealth-list': {
        controller: 'Appointment/TelehealthAppointmentController',
        action: 'GetListTelehealthAppointment'
    },

    'get /api/appointment-telehealth-detail/:UID': {
        controller: 'Appointment/TelehealthAppointmentController',
        action: 'GetDetailTelehealthAppointment'
    },
    'post /api/appointment-telehealth-update': {
        controller: 'Appointment/TelehealthAppointmentController',
        action: 'UpdateRequestTelehealthAppointment'
    },
    'post /api/appointment-telehealth-disable': {
        controller: 'Appointment/TelehealthAppointmentController',
        action: 'DisableTelehealthAppointment'
    },
    'post /api/appointment-wa-request': {
        controller: 'Appointment/WAAppointmentController',
        action: 'RequestWAAppointment'
    },

    'post /api/appointment-wa-list': {
        controller: 'Appointment/WAAppointmentController',
        action: 'GetListWAAppointment'
    },

    'get /api/appointment-wa-detail/:UID': {
        controller: 'Appointment/WAAppointmentController',
        action: 'GetDetailWAAppointment'
    },
    'post /api/appointment-wa-update': {
        controller: 'Appointment/WAAppointmentController',
        action: 'UpdateRequestWAAppointment'
    },
    'post /api/appointment-wa-disable': {
        controller: 'Appointment/WAAppointmentController',
        action: 'DisableWAAppointment'
    },
    'post /api/appointment/list': {
        controller: 'Appointment/AppointmentController',
        action: 'GetListAppointment'
    },
};
