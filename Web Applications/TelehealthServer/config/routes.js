module.exports.routes = {
    //=================Telehealth User Routes======================
    'POST /api/telehealth/user/updateToken': {
        controller: 'TelehealthController',
        action: 'UpdateDeviceToken'
    },
    'POST /api/telehealth/user/requestActivationCode': {
        controller: 'TelehealthController',
        action: 'RequestActivationCode'
    },
    'POST /api/telehealth/user/verifyActivationCode': {
        controller: 'TelehealthController',
        action: 'VerifyActivationCode'
    },
    'POST /api/telehealth/user/login': {
        controller: 'TelehealthController',
        action: 'TelehealthLogin'
    },
    'POST /api/telehealth/user/details': {
        controller: 'TelehealthController',
        action: 'GetUserDetails'
    },
    'POST /api/telehealth/user/appointments': {
        controller: 'TelehealthController',
        action: 'GetUserAppointments'
    },
    'POST /api/telehealth/user/appointmentDetails':{
        controller: 'TelehealthController',
        action: 'GetAppointmentDetails'
    },
    'POST /api/telehealth/sendSMS': {
        controller: 'TelehealthController',
        action: 'SendSMS'
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
    '/api/telehealth/socket/onlineList': {
        controller: 'SocketController',
        action: 'OnlineUserList'
    },
    'GET /api/telehealth/socket/generateSession': {
        controller: 'SocketController',
        action: 'GenerateConferenceSession'
    }
};