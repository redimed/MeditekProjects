var app = angular.module('app.authentication.notification.directive.global', []);

app.directive('notificationGlobal', function() {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/global.html',
        options: {
            scope: '='
        },
        controller: function($scope, notificationServices, toastr) {

        }
    };
});
