var app = angular.module('app.authentication.admission.request.step1.modalDelete1.controller',[]);

app.controller('modalDelete1Ctrl', function($scope, $modalInstance, titleModal, index){
	$scope.title = titleModal;
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
    	$modalInstance.close({
    		index: index,
    	});
    };
});