var app = angular.module('app.authentication.WAAppointment.list.detail.controller',[
]);

app.controller('WAAppointmentListDetailCtrl', function($scope, $modalInstance,data){
	$scope.wainformation = data;
	$scope.close = function(){
		$modalInstance.close();
	};
});