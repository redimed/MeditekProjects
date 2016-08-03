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
        .state("authentication.notification.list", {
            url: "/list",
            data: { pageTitle: 'Notification' },
            controller: "notificationListCtrl",
            templateUrl: "modules/notification/views/notificationlist.html",
        })
        .state("authentication.notification.todo", {
            url: "/todo",
            data: { pageTitle: 'Todo' },
            controller: "notificationTodoCtrl",
            templateUrl: "modules/notification/views/notificationTodo.html",
        })
        .state("authentication.notification.request", {
            url: "/request",
            data: { pageTitle: 'Request' },
            controller: "notificationRequestCtrl",
            templateUrl: "modules/notification/views/notificationRequest.html",
        })
        ;
});
