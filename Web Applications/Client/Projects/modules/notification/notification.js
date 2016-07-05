var app = angular.module("app.authentication.notification",[
	"app.authentication.notification.controller",
]);

app.config(function($stateProvider){
	$stateProvider
		.state("authentication.notification", {
			abstract: true,
			url: "/notification",
			controller: "notificationCtrl",
			templateUrl: "modules/notification/views/notification.html",
		})
		.state("authentication.notification.global", {
			url: "/global",
			data: {pageTitle: 'Notification'},
			controller: "notificationGlobalCtrl",
			templateUrl: "modules/notification/views/notificationGlobal.html",
		})
		.state("authentication.notification.private", {
			url: "/private",
			data: {pageTitle: 'Notification'},
			controller: "notificationPrivateCtrl",
			templateUrl: "modules/notification/views/notificationPrivate.html",
		})
		;
});