var app = angular.module('app.authentication.WAAppointment.directives.detailWAAppoint', []);
app.directive('detailWaappoint', function($modal, $cookies) {
    return {
        restrict: 'E',
        templateUrl: "modules/WAAppointment/directives/templates/WAAppointmentDetail.html",
        link: function(scope) {
        	
        }
    };
})