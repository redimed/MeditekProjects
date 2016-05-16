var app = angular.module('app.blank', [
    'app.blank.controller',
    'app.blank.services',
    'app.blank.drawing',
    'app.blank.directive',
]);

app.config(function($stateProvider) {
    $stateProvider
        .state('blank', {
            abstract: true,
            // url: '/blank',
            views: {
                'root': {
                    templateUrl: 'modules/blank/views/blank.html',
                    controller: 'blankCtrl',
                },
            },
        })
        .state('blank.call', {
            data: { pageTitle: 'Call' },
            url: '/call/:apiKey/:sessionId/:token/:teleCallUID/:receiverName/:receiverUID/:callerUID',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/call.html',
                    controller: 'callCtrl',
                },
            },
        })
        .state('blank.receive', {
            data: { pageTitle: 'Receive Call' },
            url: '/receive/:apiKey/:sessionId/:token/:userName',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/receive.html',
                    controller: 'receiveCtrl',
                },
            },
        })
        .state('blank.welcome', {
            data: { pageTitle: 'welcome' },
            url: '/welcome',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/welcome.html',
                    // controller: 'welcomeCtrl',
                },
            },
        })
        .state('blank.welcomeCampaign', {
            data: { pageTitle: 'Welcome Compaign' },
            url: '/welcomeCampaign',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/welcomeCampaign.html',
                    controller: 'welcomeCampaignCtrl',
                },
            },
        })
        .state('blank.registerPatient', {
            data: { pageTitle: 'registerPatient' },
            url: '/registerPatient',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/registerPatient.html',
                    controller: 'registerPatientCtrl',
                },
            },
        })
        .state('blank.searchPatient', {
            data: { pageTitle: 'searchPatient' },
            url: '/searchPatient/:typePatient',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/searchPatient.html',
                    controller: 'searchPatientCtrl',
                },
            },
        })
        .state('blank.registerPatientCampaign', {
            data: { pageTitle: 'registerPatientCampaign' },
            url: '/registerPatientCampaign',
            views: {
                'blank': {
                    templateUrl: 'modules/blank/views/registerPatientCampaign.html',
                    controller: 'registerPatientCampaignCtrl',
                },
            },
        });
});
