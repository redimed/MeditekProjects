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
    'get /api/appointment-wa-detail/eform/:UID': {
        controller: 'Appointment/WAAppointmentController',
        action: 'GetDetailWAAppointmentforEform'
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
    'post /api/appointment-wa-request/patient': {
        controller: 'Appointment/WAAppointmentController',
        action: 'RequestWAAppointmentPatient'
    },
    'post /api/appointment-wa-list/consultation': {
        controller: 'Appointment/WAAppointmentController',
        action: 'GetListWAAppointmentConsultation'
    },
    'post /api/appointment-wa-request/patient-onlinebooking': {
        controller: 'Appointment/WAAppointmentController',
        action: 'RequestWAAppointmentPatientOnlineBooking'
    },
    'post /api/appointment-wa-request/company': {
        controller: 'Appointment/WAAppointmentController',
        action: 'RequestAppointmentCompany'
    },
    'post /api/onlinebooking/appointment-request': {
        controller: 'Appointment/WAAppointmentController',
        action: 'RequestAppointmentMedicalBooking'
    },
    'post /api/appointment-wa-request/patient-new': {
        controller: 'Appointment/WAAppointmentController',
        action: 'RequestWAAppointmentPatientNew'
    },
    'post /api/appointment-wa-update/company': {
        controller: 'Appointment/WAAppointmentController',
        action: 'UpdateRequestWAAppointmentCompany'
    }
};
