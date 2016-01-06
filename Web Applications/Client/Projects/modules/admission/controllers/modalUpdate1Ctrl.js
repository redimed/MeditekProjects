var app = angular.module('app.authentication.admission.request.step1.modalUpdate1.controller',[]);

app.controller('modalUpdate1Ctrl', function($scope, $state, $uibModal, $modalInstance, titleModal, dataModal, index){
    $scope.title = titleModal;
	$scope.data = angular.copy(dataModal);
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
    	$modalInstance.close({
    		data: $scope.data,
    		index: index,
    	});
    };
});