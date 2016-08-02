var app = angular.module('app.authentication.booking.scheduler.delete.controller',[]);

/*
output variables
	selectedDate
	formData: {
		fromTime
		toTime
	}
*/

app.controller('schedulerDeleteCtrl', function($scope, UID, BookingService, $timeout, $uibModal, $modalInstance, toastr){
	$modalInstance.rendered.then(function(){
		function getDateCalendar() {
            var date = $('#calendar').fullCalendar('getDate');
            var today = moment(date).format('YYYY-MM-DD');
            return today;            
        }
        var DateToday = getDateCalendar();
        $('#calendar').fullCalendar( 'removeEvents', function(event) {
            if(moment(event._start._i).format('YYYY-MM-DD') === DateToday)
                return true;
        });
		App.initAjax();
		ComponentsDateTimePickers.init();
	});
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	$scope.submit = function(){
		BookingService.DestroyBooking({UID: UID})
		.then(function(response){
			toastr.success('Delete Booking Successfully');
			$modalInstance.close();
		}, function(error){

		})
	};
});