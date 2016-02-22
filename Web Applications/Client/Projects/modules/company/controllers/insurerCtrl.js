var app = angular.module('app.authentication.company.detail.insurer.controller',[
]);

app.controller('insurerCtrl', function($scope, $modalInstance, modal_action, modal_data, modal_index){
	$scope.submitted = false;
	$scope.title = modal_action;
	$scope.data = modal_index === -1 ? {} : angular.copy(modal_data[modal_index]);;
	$scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.submit = function(){
    	$scope.submitted = true;
    	if($scope.form.$valid){
	    	if(modal_action === 'add'){
	    		modal_data.push($scope.data);
	    		$modalInstance.close();
	    	} else if(modal_action === 'update'){
				$modalInstance.close({
		    		data: $scope.data,
		    		index: modal_index,
		    	});
	    	} else if(modal_action === 'delete'){
				$modalInstance.close({
		    		index: modal_index,
		    	});
	    	}
	    }
    };
});