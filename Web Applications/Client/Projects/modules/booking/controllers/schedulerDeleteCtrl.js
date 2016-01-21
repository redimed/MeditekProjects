var app = angular.module('app.authentication.booking.scheduler.delete.controller',[]);

/*
output variables
	selectedDate
	formData: {
		fromTime
		toTime
	}
*/

app.controller('schedulerDeleteCtrl', function($scope, event, $timeout, $uibModal, $modalInstance, toastr){
	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	$scope.submit = function(){
		
	};
});