var app = angular.module('app.authentication.patient.list.modal.controller', []);

app.controller('patientListModalCtrl', function( $scope, data, PatientService, $uibModal, $modalInstance, $state, toastr){
	$scope.onCancel = function(){
		$modalInstance.dismiss('cancel');
	}
});

