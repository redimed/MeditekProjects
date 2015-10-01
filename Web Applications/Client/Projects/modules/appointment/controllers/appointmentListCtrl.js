var app = angular.module('app.loggedIn.appointment.list.controller', [
]);

app.controller('appointmentListCtrl', function($scope, $modal, $state){
	$scope.openAppointmentModal = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl:'modules/appointment/views/appointmentModal.html',
			controller: 'appointmentModalCtrl',
			windowClass : 'app-modal-window',
			resolve: {
				getid: function(){
					return true;
				}
			}

		});
	};
});

app.controller('appointmentModalCtrl', function($scope, $modal, $modalInstance){

});