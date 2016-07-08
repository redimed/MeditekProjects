module.exports = {
    'post /api/eform/template/list': {
        controller: 'EForm/EFormController',
        action: 'GetListEFormTemplate'
    },

    'post /api/eform/get-history-by-appointment': {
    	controller: 'EForm/EFormController',
    	action: 'GetHistoryByAppointment'
    },
};
