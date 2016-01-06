var app = angular.module('app.authentication.admission.request.step1.modalAdd2.controller',[]);

app.controller('modalAdd2Ctrl', function($scope, $state, $uibModal, $modalInstance, titleModal, MEDICATIONS){
	$modalInstance.rendered.then(function(){
		// App.initAjax();
		ComponentsDateTimePickers.init();
	});
    $scope.title = titleModal;
	$scope.data = {};
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
    	MEDICATIONS.push($scope.data);
    	$modalInstance.close();
    };
});