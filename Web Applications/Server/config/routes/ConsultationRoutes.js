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
        action: 'GetDetailConsultation'
    },
    'post /api/consultation/update': {
        controller: 'Consultation/ConsultationController',
        action: 'UpdateConsultation'
    },
    'get /api/consultation/destroy/:UID': {
        controller: 'Consultation/ConsultationController',
        action: 'DestroyConsultation'
    }
};
