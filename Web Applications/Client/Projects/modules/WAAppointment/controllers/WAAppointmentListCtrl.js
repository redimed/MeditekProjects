var app = angular.module('app.authentication.WAAppointment.list.controller', [
    'app.authentication.WAAppointment.detail.controller'
]);

app.controller('WAAppointmentListCtrl', function($scope, $modal, WAAppointmentService, $state) {
    $scope.toggle = true;
    $scope.toggleFilter = function() {
        $scope.toggle = $scope.toggle === false ? true : false;
    };
    $scope.apptData = {
        getDetailWAAppointmentByUid: function(UID) {
            o.loadingPage(true);
            WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
                $scope.ObjectWa.wainformation = data.data;
                o.loadingPage(false);
                $state.go("authentication.WAAppointment.detail");
            }, function(error) {});
        }
    };
    $scope.WAAppointmentDetail = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
            controller: 'WAAppointmentListDetailCtrl',
            windowClass: 'app-modal-window',
            resolve: {
                getid: function() {
                    return true;
                }
            }
        });
    }
});
