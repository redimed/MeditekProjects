var app = angular.module('app.authentication.appointment.list.modal.controller', [
]);

app.controller('appointmentListModalCtrl', function($scope, $modal, $modalInstance,getid,AppointmentService){
	$scope.modal_close = function(){
		$modalInstance.close();
	};
	$scope.close = function(){
		$modalInstance.close();
	};
	$scope.appointment = null;
	$scope.tab_body_part = 'all';
	var load = function(){
		AppointmentService.getDetailApppointment(getid).then(function(response){
			$scope.appointment =  response.data
		});
	}
	$scope.appointment = {
		load: function(){load();}
	}
	$scope.appointment.load();

});
