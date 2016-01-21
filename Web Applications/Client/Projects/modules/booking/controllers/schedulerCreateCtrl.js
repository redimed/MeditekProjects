var app = angular.module('app.authentication.booking.scheduler.create.controller',[]);

app.controller('schedulerCreateCtrl', function($scope, event, $timeout, $modalInstance, toastr){

	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});
	$scope.selectedDate = moment(event._d).format('DD/MM/YYYY');
	$scope.formData = {
		service: '',
		fromTime: '',
		toTime: '',
		isReoccurance: 'N',
		reoccuranceType: '',
		endReoccurance: null,
	};
	function resetReoccurance(){
		$scope.formData.reoccuranceType = '';
		$scope.formData.endReoccurance = null;
	};
	$scope.checkReoccurance = function(isReoccurance){
		if(isReoccurance === 'N'){
			resetReoccurance();
		}
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};

	$scope.submit = function(){
		if($scope.formData.service === ''){
			toastr.error('Service must be filled');
		}else{
			$modalInstance.close($scope.formData);
		}

	};
});