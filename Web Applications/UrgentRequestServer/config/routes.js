module.exports.routes = {
    'post /api/urgent-care/urgent-request': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'ReceiveRequest'
    },
    'get /api/urgent-care/urgent-confirm/:id': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'ConfirmRequest'
    },
    'get /api/urgent-care/post-code/:lat/:long': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'GetPostCode'
    },
    'get /api/urgent-care/suburb': {
        controller: 'UrgentCare/UrgentCareController',
        action: 'GetSuburb'
    }
};
