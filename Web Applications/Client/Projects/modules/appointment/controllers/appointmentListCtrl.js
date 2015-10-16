var app = angular.module('app.authentication.appointment.list.controller', [
	'app.authentication.appointment.list.modal.controller'
]);

app.controller('appointmentListCtrl', function($scope, $modal, $state,AppointmentService){

	$scope.openAppointmentModal = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl:'modules/appointment/views/appointmentListModal.html',
			controller: 'appointmentListModalCtrl',
			windowClass : 'app-modal-window',
			//size: 'lg',
			resolve: {
				getid: function(){
					return true;
				}
			}
		});
	};
});