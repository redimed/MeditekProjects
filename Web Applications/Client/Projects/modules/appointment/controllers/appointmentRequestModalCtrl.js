var app = angular.module('app.authentication.appointment.request.modal.controller', [
]);

app.controller('appointmentRequestModalCtrl', function($scope, $modal, $modalInstance){
	$scope.modal_close = function(){ $modalInstance.close(); };
	$scope.close = function(){ $modalInstance.close(); };
});