module.exports.routes = {
    'post /api/urgent-care/urgent-request': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'ReceiveRequest'
    },
    'get /api/urgent-care/urgent-confirm/:id': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'ConfirmRequest'
    }
};
