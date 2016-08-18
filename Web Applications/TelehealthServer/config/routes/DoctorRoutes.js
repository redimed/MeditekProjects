module.exports = {
	'POST /api/doctor/get-doctor': {
        controller: 'Doctor/v1_0/DoctorController',
        action: 'GetDoctor'
    },
    'POST /api/doctor/user': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthUserNew'
    },
    'GET /api/doctor/user/WAAppointmentDetails/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetWAAppointmentDetails'
    },
    'GET /api/doctor/user/telehealthAppointmentDetails/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthAppointmentDetails'
    },
    'POST /api/doctor/appointment/list': {
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'ListAppointment'
    },
    'POST /api/doctor/user/updateToken': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'UpdateDeviceToken'
    },
    'POST /api/doctor/user/pushNotification': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'PushNotification'
    },
};
