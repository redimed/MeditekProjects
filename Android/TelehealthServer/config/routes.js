module.exports.routes = {
    //=================Telehealth User Routes======================
    'POST /telehealth/user/updateToken': {
        controller: 'TelehealthController',
        action: 'UpdateDeviceToken'
    },
    'POST /telehealth/user/requestActivationCode': {
        controller: 'TelehealthController',
        action: 'RequestActivationCode'
    },
    'POST /telehealth/user/verifyActivationCode': {
        controller: 'TelehealthController',
        action: 'VerifyActivationCode'
    },
    'POST /telehealth/user/login': {
        controller: 'TelehealthController',
        action: 'TelehealthLogin'
    },
    //================Telehealth Socket Routes==========================
    '/telehealth/socket/joinRoom': {
        controller: 'SocketController',
        action: 'JoinRoom'
    }
};
