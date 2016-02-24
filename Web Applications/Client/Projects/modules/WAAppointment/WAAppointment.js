var app = angular.module('app.authentication.WAAppointment', [
    'app.authentication.WAAppointment.controller',
    'app.authentication.WAAppointment.services'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('authentication.WAAppointment', {
            abstract: true,
            url: '/Appointment',
            data: {
                title: 'Appointment',
                pageTitle: 'Appointment'
            },
            templateUrl: 'modules/WAAppointment/views/WAAppointment.html',
            controller: 'WAAppointmentCtrl',
        })
        .state('authentication.WAAppointment.list', {
            url: '/list',
            data: {
                title: 'Appointment',
                pageTitle: 'Appointment'
            },
            templateUrl: 'modules/WAAppointment/views/WAAppointmentList.html',
            controller: 'WAAppointmentListCtrl',
            resolve: {
                function() {
                    $('.input-daterange').datepicker({});
                },
            },
        })
        .state('authentication.WAAppointment.detail', {
            url: '/detail/:UID',
            data: {
                title: 'Appointment Detail',
                pageTitle: 'Appointment Detail'
            },
            templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
            controller: 'WAAppointmentListDetailCtrl',
        })
        .state('authentication.WAAppointment.GP', {
            url: '/request',
            data: {
                title: 'Appointment Send Request',
                pageTitle: 'Appointment Send Request'
            },
            templateUrl: 'modules/WAAppointment/views/WAAppointmentGP.html',
            controller: 'WAAppointmentGPCtrl',
        });
});
