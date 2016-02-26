var app = angular.module('app.authentication.roster.calendar.delete.controller',[]);

/*
output variables
	selectedDate
	formData: {
		fromTime
		toTime
	}
*/

app.controller('calendarDeleteCtrl', function($scope, $stateParams, RosterService, data, $timeout, $uibModal, $modalInstance, toastr){
	$scope.data = data;
	$scope.case = {
		isOccurance: 'N'
	}
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	$scope.submit = function(){
		RosterService.DestroyRoster({
			Roster: {
				UID: data.UID,
				CaseOccurance: $scope.case.isOccurance
			},
			UserAccount: {
				UID:  $stateParams.doctorId
			}
		})
		.then(function(response){
			if(response.status === 'existAppt'){
				toastr.error('Appointment Booking Existed');
			}
			$modalInstance.close();
		}, function(error){

		})
	};
});