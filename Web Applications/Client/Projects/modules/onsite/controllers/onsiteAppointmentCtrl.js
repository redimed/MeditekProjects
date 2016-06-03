var app = angular.module('app.authentication.onsite.appointment.controller',[
]);

app.controller('onsiteAppointmentCtrl', function($scope, $uibModal){
	$scope.onsites = [];
	  $scope.runWhenFinish = {
    	success:function () {
    		$state.go($state.current, {UID:$stateParams.UID,UIDPatient:$stateParams.UIDPatient}, {reload: true});
    	}
    };
});