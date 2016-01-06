module.exports = {
    'post /api/consultation/create': {
        controller: 'Consultation/ConsultationController',
        action: 'RequestConsultation'
    },
    'post /api/consultation/list': {
        controller: 'Consultation/ConsultationController',
        action: 'GetListConsultation'
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
    },
    'get /api/consultation/drawing/list': {
        controller: 'Consultation/DrawingController',
        action: 'GetDrawingTemplates'
    },
    'get /api/consultation/drawing/getbase64/:id': {
        controller: 'Consultation/DrawingController',
        action: 'GetDrawingTemplateBase64'
    },
    'get /api/consultation/drawing/getfile/:id': {
        controller: 'Consultation/DrawingController',
        action: 'GetDrawingTemplateFile',
    },

};
