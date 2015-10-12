var app = angular.module('app.authentication.appointment.list.modal.controller', [
]);

app.controller('appointmentListModalCtrl', function($scope, $modal, $modalInstance){
	
	$scope.modal_close = function(){
		$modalInstance.close();
	};
	$scope.close = function(){
		$modalInstance.close();
	};


});
