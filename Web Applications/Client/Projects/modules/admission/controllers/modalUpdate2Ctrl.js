var app = angular.module('app.authentication.admission.detail.step1.modalUpdate2.controller',[]);

app.controller('modalUpdate2Ctrl', function($scope, $state, $uibModal, $modalInstance, titleModal, dataModal, index){
    $scope.title = titleModal;
	$scope.data = angular.copy(dataModal);
    $scope.Cancel = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
    	$modalInstance.close({
    		data: $scope.data,
    		index: index,
    	});
    };
});