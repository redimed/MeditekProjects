var app = angular.module('app.authentication.admission.request.step1.modalAdd1.controller',[]);

app.controller('modalAdd1Ctrl', function($scope, $state, $uibModal, $modalInstance, titleModal, PREVIOUS_SURGERY_PROCEDURES){
	$scope.title = titleModal;
	$scope.data = {};
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
    	PREVIOUS_SURGERY_PROCEDURES.push($scope.data);
    	$modalInstance.close();
    };
});