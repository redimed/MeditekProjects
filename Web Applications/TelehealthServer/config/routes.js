module.exports.routes = {
    //=================Telehealth User Routes======================
    // khong xai nua
    'POST /api/telehealth/user/updateToken': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'UpdateDeviceToken'
    },

    //khong xai nua
    'POST /api/telehealth/user/requestActivationCode': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'RequestActivationCode'
    },
    //khong xai nua
    'POST /api/telehealth/user/verifyActivationCode': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'VerifyActivationCode'
    },

    //=================Login====================
    'POST /api/telehealth/checkActivation': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'CheckActivation'
    },
    //=====================================

    'GET /api/telehealth/user/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthUser'
    },
    'POST /api/telehealth/user': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthUserNew'
    },
    'GET /api/telehealth/user/details/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetPatientDetails'
    },
    'POST /api/telehealth/user/update': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'UpdatePatientDetails'
    },
    'POST /api/telehealth/user/enableFile': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'ChangeEnableFile'
    },
    'POST /api/telehealth/user/appointments': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetUserAppointments'
    },
    'GET /api/telehealth/user/telehealthAppointmentDetails/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthAppointmentDetails'
    },
    'GET /api/telehealth/user/WAAppointmentDetails/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetWAAppointmentDetails'
    },
    'POST /api/telehealth/user/pushNotification': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'PushNotification'
    },
    'POST /api/telehealth/user/forgetPin': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'ForgetPIN'
    },
    'POST /api/telehealth/listDoctor': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetListDoctor'
    },
    'GET /api/telehealth/listCountry': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetListCountry'
    },
    'POST /api/telehealth/sendCoreServer': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'SendCoreServer'
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
    '/api/telehealth/logout': {
        controller: 'SocketController',
        action: 'Logout'
    },
    '/api/telehealth/socket/addDoctor': {
        controller: 'SocketController',
        action: 'AddDoctor'
    },
    'GET /api/telehealth/socket/generateSession': {
        controller: 'SocketController',
        action: 'GenerateConferenceSession'
    },
    'GET /api/telehealth/socket/listRoom': {
        controller: 'SocketController',
        action: 'ListRoomSocket'
    },
    'POST /api/telehealth/socket/totalUserInRoom': {
        controller: 'SocketController',
        action: 'TotalUserInRoom'
    },
    //=================Telehealth Appointment============================
    'POST /api/telehealth/appointment/updateFile': {
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'UpdateFile'
    },
    'POST /api/telehealth/appointment/list': {
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'ListAppointment'
    },
    'POST /api/telehealth/appointment/request': {
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'RequestAppointmentPatient'
    },
    //=================Test Push Notification=============================
    'GET /api/testPushAPN/:badge': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'TestPushAPN'
    },
    'GET /api/testPushGCM': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'TestPushGCM'
    }
};