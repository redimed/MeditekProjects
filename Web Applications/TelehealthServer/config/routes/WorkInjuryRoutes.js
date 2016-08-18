module.exports = {
    'GET /api/workinjury/detail-company-by-user/:userUid': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'GetDetailCompanyByUser'
    },
    'GET /api/workinjury/get-list-staff/:userUid': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'GetListStaff'
    },
    'GET /api/workinjury/get-list-site/:companyUid': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'GetListSite'
    },
    'GET /api/workinjury/get-user-account-detail/:UID': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'GetUserAccountDetail'
    },
    'POST /api/workinjury/detail-patient': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'GetDetailPatient'
    },
    'POST /api/workinjury/appointment-request-company': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'AppointmentRequestCompany'
    },
    'POST /api/workinjury/appointment-request-patient': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'AppointmentRequestPatient'
    },
    'POST /api/workinjury/eform-redisite': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'EformRedisite'
    },
    'POST /api/workinjury/load-detail-company': {
        controller: 'WorkInjury/v1_0/WorkInjuryController',
        action: 'LoadDetailCompany'
    },



    // ============================ Telehealth
    'GET /api/workinjury/user/details/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetPatientDetails'
    },
    'POST /api/workinjury/user': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetTelehealthUserNew'
    },
    'POST /api/workinjury/user/forgetPin': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'ForgetPIN'
    },
    'POST /api/workinjury/updatePinNumber': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'UpdatePinNumber'
    },
    'POST /api/workinjury/user/update': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'UpdatePatientDetails'
    },
    'POST /api/workinjury/checkActivation': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'CheckActivation'
    },
    'POST /api/workinjury/logout': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'Logout'
    },
    'POST /api/workinjury/user/appointments': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetUserAppointments'
    },
    'GET /api/workinjury/user/WAAppointmentDetails/:uid': {
        controller: 'Telehealth/v1_0/TelehealthController',
        action: 'GetWAAppointmentDetails'
    },
    'POST /api/workinjury/appointment/updateFile': {
        controller: 'Telehealth/v1_0/AppointmentController',
        action: 'UpdateFile'
    },

};
