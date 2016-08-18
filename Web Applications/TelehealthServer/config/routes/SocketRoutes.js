module.exports = {
	'/api/socket/joinRoom': {
        controller: 'Socket/v1_0/SocketController',
        action: 'JoinConferenceRoom'
    },
    '/api/socket/messageTransfer': {
        controller: 'Socket/v1_0/SocketController',
        action: 'MessageTransfer'
    },
    '/api/socket/addDoctor': {
        controller: 'Socket/v1_0/SocketController',
        action: 'AddDoctor'
    },
    'GET /api/socket/generateSession': {
        controller: 'Socket/v1_0/SocketController',
        action: 'GenerateConferenceSession'
    },
    'GET /api/socket/listRoom': {
        controller: 'Socket/v1_0/SocketController',
        action: 'ListRoomSocket'
    },
    'POST /api/socket/totalUserInRoom': {
        controller: 'Socket/v1_0/SocketController',
        action: 'TotalUserInRoom'
    },
};
