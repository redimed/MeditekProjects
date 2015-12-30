module.exports = {
    'post /api/consultation/list': {
        controller: 'Consultation/ConsultationController',
        action: 'GetListConsultation'
    },
    'post /api/consultation/create': {
        controller: 'Consultation/ConsultationController',
        action: 'CreateConsultation'
    },
    'get /api/consultation/detail/:UID': {
        controller: 'Consultation/ConsultationController',
        action: 'DetailConsultation'
    },
    'post /api/consultation/update': {
        controller: 'Consultation/ConsultationController',
        action: 'UpdateConsultation'
    },
    'post /api/consultation/destroy/:UID': {
        controller: 'Consultation/ConsultationController',
        action: 'DestroyConsultation'
    }
};
