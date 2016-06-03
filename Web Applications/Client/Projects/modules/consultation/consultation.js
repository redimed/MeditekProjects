var app = angular.module('app.authentication.consultation', [
    'app.authentication.consultation.controller',
    'app.authentication.consultation.services',
    'app.authentication.consultation.TelehealthDetail.directives',
    'app.authentication.consultation.listadmissionpatient.directives'
]);

app.config(function($stateProvider) {
    $stateProvider
        .state('authentication.consultation', {
            abstract: true,
            url: '/consultation',
            data: {
                title: 'Consultation',
                pageTitle: 'Consultation'
            },
            templateUrl: 'modules/consultation/views/consultation.html',
            controller: 'consultationCtrl',
        })
        .state('authentication.consultation.list', {
            url: '/list',
            data: {
                title: 'Consultation List',
                pageTitle: 'Consultation List'
            },
            templateUrl: 'modules/consultation/views/consultationList.html',
            controller: 'consultationListCtrl',
        })
        .state('authentication.consultation.listRoleid', {
            url: '/list/:roleid',
            data: {
                title: 'Consultation List',
                pageTitle: 'Consultation List'
            },
            templateUrl: 'modules/consultation/views/consultationList.html',
            controller: 'consultationListCtrl',
        })
        .state('authentication.consultation.detail', {
            url: '/detail/:UID/:UIDPatient',
            data: {
                title: 'Consultation Detail',
                pageTitle: 'Consultation Detail'
            },
            templateUrl: 'modules/consultation/views/consultationDetail.html',
            controller: 'consultationDetailCtrl'
        })
        .state('authentication.consultation.detail.Onsite', {
            url: '/Onsite',
            data: {
                pageTitle: 'Onsite Detail'
            },
            templateUrl: 'modules/onsite/views/onsiteAppointment.html',
            controller: 'onsiteAppointmentCtrl',
        })
        .state('authentication.consultation.detail.patientAdmission', {
            url: '/patientAdmission',
            data: {
                title: 'View Patient Admission',
                pageTitle: 'View Patient Admission'
            },
            templateUrl: 'modules/consultation/views/patientAdmission.html',
            controller: 'patientAdmissionCtrl',
        })
        .state('authentication.consultation.detail.consultNote', {
            url: '/consultNote',
            data: {
                title: 'Consult Note',
                pageTitle: 'Consult Note'
            },
            templateUrl: 'modules/consultation/views/consultNote.html',
            controller: 'consultNoteCtrl',
        })
        .state('authentication.consultation.detail.telehealth', {
            url: '/telehealth',
            data: {
                title: 'Telehealth Detail',
                pageTitle: 'Telehealth Detail'
            },
            templateUrl: 'modules/consultation/views/consultationTelehealthDetail.html',
            controller: 'TelehealthDetailController',
        })
        .state('authentication.consultation.detail.eForms', {
            url: '/eForms',
            data: {
                title: 'E-Forms',
                pageTitle: 'E-Forms'
            },
            templateUrl: 'modules/consultation/views/eForms.html',
            controller: 'eFormsCtrl',
        })
        .state('authentication.consultation.drawing', {
            url: '/drawing',
            data: {
                title: 'Add Drawing',
                pageTitle: 'Add Drawing'
            },
            templateUrl: 'modules/consultation/views/drawing.html',
            controller: 'drawingCtrl',
        })
        .state('authentication.consultation.eformbypatient', {
            url: '/eform/patient/:UID/:patientUID/:userUID',
            data: {
                title: 'EForm Patient',
                pageTitle: 'EForm Patient'
            },
            templateUrl: 'modules/consultation/views/patient.html',
            controller: 'EFormPatientCtrl',
        })
});
