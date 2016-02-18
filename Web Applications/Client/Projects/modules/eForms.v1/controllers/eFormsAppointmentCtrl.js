var app = angular.module('app.authentication.eForms.appointment.controller',[
]);

app.controller('eFormsAppoitmentCtrl', function($scope, $state){
	//nhan appointment'UID tu consultaion
	console.log('eFormsAppoitmentCtrl');
	$scope.apptuid = $state.params.UID;
	$scope.patientuid = $state.params.UIDPatient;
	// $scope.apptuid = "2e4247f5-653f-48e1-a5c9-286d348190b0";//gan mac dinh
});