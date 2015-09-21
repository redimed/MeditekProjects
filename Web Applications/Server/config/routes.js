module.exports.routes = {
    'post /api/request': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'ReceiveRequest'
    },
    'get /api/confirm/:id': {
    	controller: 'UrgentCare/UrgentCareController',
    	action: 'ConfirmRequest'
    }
};
