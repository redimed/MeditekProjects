module.exports.routes = {
    //=================Telehealth User Routes======================
    'POST /api/telehealth/user/updateToken': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'UpdateDeviceToken'
    },
    'POST /api/telehealth/user/requestActivationCode': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'RequestActivationCode'
    },
    'POST /api/telehealth/user/verifyActivationCode': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'VerifyActivationCode'
    },
    'POST /api/telehealth/user/login': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'TelehealthLogin'
    },
    'POST /api/telehealth/user/details': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetUserDetails'
    },
    'POST /api/telehealth/user/appointments': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetUserAppointments'
    },
    'POST /api/telehealth/user/appointmentDetails':{
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetAppointmentDetails'
    },
    //================Telehealth Socket Routes==========================
    '/api/telehealth/socket/joinRoom': {
        controller: 'SocketController',
        action: 'JoinConferenceRoom'
    },
    '/api/telehealth/socket/messageTransfer': {
        controller: 'SocketController',
        action: 'MessageTransfer'
    },
    'GET /api/telehealth/socket/generateSession': {
        controller: 'SocketController',
        action: 'GenerateConferenceSession'
    },
    //=================Telehealth Appointment============================
    'POST /api/telehealth/appointment/updateFile':{
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'UpdateFile'
    },
    'GET /api/telehealth/appointment/listWA':{
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'ListWA'
    }
};