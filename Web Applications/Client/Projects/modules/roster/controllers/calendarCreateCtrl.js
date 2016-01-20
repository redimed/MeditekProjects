var app = angular.module('app.authentication.roster.calendar.create.controller',[]);

/*
output variables
	selectedDate
	formData: {
		fromTime
		toTime
	}
*/

app.controller('calendarCreateCtrl', function($scope, event, $timeout, $modalInstance, toastr){

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

	function convertToTime24(timeString){
		var split = timeString.split(':');
		return parseInt(split[0]+split[1]);
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

	function appendTime(time){
		return (time < 10)?'0'+time:time;
	}

	function appendFullCalendarDateTime(date, time){
		var split_time = time.split(':');
		var hour = appendTime(split_time[0]);
		var minute = split_time[1];
		return moment(date).format('YYYY-MM-DD')+'T'+hour+':'+minute+':00';
	}

	$scope.submit = function(){
		var service = $scope.formData.service;
		var isReoccurance = $scope.formData.isReoccurance;
		var reoccuranceType = $scope.formData.reoccuranceType;
		var reoccuranceDate = $scope.formData.endReoccurance;

		console.log(isReoccurance);

		if(service === ''){
			toastr.error('Service must be filled');
		}
		else if($scope.formData.fromTime === ''){
			toastr.error('From Time must be filled');	
		}
		else if($scope.formData.toTime === ''){
			toastr.error('End Time must be filled');
		}
		else{
			var fromTimeParse = convertToTime24($scope.formData.fromTime);
			var toTimeParse = convertToTime24($scope.formData.toTime);
			if(fromTimeParse > toTimeParse){
				toastr.error('From Time must be smaller than To Time !!!');
			}else{
				var startTime = appendFullCalendarDateTime(event._d, $scope.formData.fromTime);
				var endTime = appendFullCalendarDateTime(event._d, $scope.formData.toTime);
				var returnData = {
					title: service,
					start: startTime,
					end: endTime
				}
				console.log(startTime);
				$modalInstance.close(returnData);
			}
		}
	};
});