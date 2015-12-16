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
    'GET /api/telehealth/user/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthUser'
    },
    'GET /api/telehealth/user/details/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetPatientDetails'
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
    'POST /api/telehealth/user/pushNotification':{
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'PushNotification'
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
    'POST /api/telehealth/appointment/list':{
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'ListAppointment'
    },
    //=================Test Push Notification=============================
    'GET /api/testPushAPN':{
        controller: 'Telehealth/v1_0/TelehealthController',
        action:'TestPushAPN'
    },
    'GET /api/testPushGCM':{
        controller: 'Telehealth/v1_0/TelehealthController',
        action:'TestPushGCM'
    }
};