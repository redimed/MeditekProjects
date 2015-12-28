var app = angular.module('app.authentication.admission.detail.step1.modalDelete2.controller',[]);

app.controller('modalDelete2Ctrl', function($scope, $modalInstance, titleModal, index){
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