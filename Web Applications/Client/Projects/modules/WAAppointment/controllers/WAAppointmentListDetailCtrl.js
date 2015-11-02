var app = angular.module('app.authentication.WAAppointment.list.detail.controller',[
]);

app.controller('WAAppointmentListDetailCtrl', function($scope, $modalInstance){
	$scope.close = function(){
		$modalInstance.close();
	};
});