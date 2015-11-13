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
    'GET /api/telehealth/user/details/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetUserDetails'
    },
    'GET /api/telehealth/user/appointments/:uid/:type?/:limit?': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetUserAppointments'
    },
    'GET /api/telehealth/user/telehealthAppointmentDetails/:uid':{
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthAppointmentDetails'
    },
    'GET /api/telehealth/user/WAAppointmentDetails/:uid':{
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetWAAppointmentDetails'
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
    'GET /api/telehealth/appointment/list/:type?':{
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'ListAppointment'
    }
};