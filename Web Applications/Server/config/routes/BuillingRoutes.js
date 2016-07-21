module.exports = {
    'post /api/builling/create': {
        controller: 'Builling/BuillingController',
        action: 'CreateBuilling'
    },

    'get /api/builling/read/:UID': {
        controller: 'Builling/BuillingController',
        action: 'ReadBuilling'
    },

    'post /api/builling/update': {
        controller: 'Builling/BuillingController',
        action: 'UpdateBuilling'
    },
    'post /api/builling/destroy/:UID': {
        controller: 'Builling/BuillingController',
        action: 'DestroyBuilling'
    }
};
