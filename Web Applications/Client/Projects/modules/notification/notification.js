var app = angular.module("app.authentication.notification", [
    "app.authentication.notification.controller",
    "app.authentication.notification.service",
    "app.authentication.notification.directive.global",
    "app.authentication.notification.directive.private",
    "app.authentication.notification.directive.sended",
]);

app.config(function($stateProvider) {
    $stateProvider
        .state("authentication.notification", {
            abstract: true,
            url: "/notification",
            controller: "notificationCtrl",
            templateUrl: "modules/notification/views/notification.html",
        })
        .state("authentication.notification.global", {
            url: "/global",
            data: { pageTitle: 'Notification' },
            controller: "notificationGlobalCtrl",
            templateUrl: "modules/notification/views/notificationGlobal.html",
        })
        .state("authentication.notification.private", {
            url: "/private",
            data: { pageTitle: 'Notification' },
            controller: "notificationPrivateCtrl",
            templateUrl: "modules/notification/views/notificationPrivate.html",
        })
        .state("authentication.notification.sended", {
            url: "/sended/:type",
            data: { pageTitle: 'Sended' },
            controller: "notificationGlobalSendedCtrl",
            templateUrl: "modules/notification/views/notificationGlobalSended.html",
        });
});
