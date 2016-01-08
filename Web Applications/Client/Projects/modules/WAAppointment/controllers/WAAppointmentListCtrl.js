var app = angular.module('app.authentication.WAAppointment.list.controller',[
	'app.authentication.WAAppointment.detail.controller'
]);

app.controller('WAAppointmentListCtrl', function($scope, $modal,WAAppointmentService){
	$scope.toggle = true;
    $scope.toggleFilter = function() {
        $scope.toggle = $scope.toggle === false ? true : false;
    };

    $scope.WAAppointmentDetail = function(){
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