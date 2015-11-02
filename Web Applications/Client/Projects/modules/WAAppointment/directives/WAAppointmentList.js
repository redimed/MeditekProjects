var app = angular.module('app.authentication.WAAppointment.directives.listWAAppoint', []);
app.directive('listWaapointment', function(AppointmentService, $modal, $cookies) {
    return {
        restrict: 'E',
        templateUrl: "modules/WAAppointment/directives/templates/listWAApointment.html",
        link: function(scope) {
            scope.toggle = true;
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };

            scope.WAAppointmentDetail = function() {
                $modal.open({
                    templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
                    controller: 'WAAppointmentListDetailCtrl',
                    windowClass: 'app-modal-window',
                })
            }
        }
    };
})
