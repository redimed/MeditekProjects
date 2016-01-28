var app = angular.module('app.authentication.booking.scheduler.create.controller',[]);

app.controller('schedulerCreateCtrl', function($scope, BookingService, RosterService, event, start, end, PatientService, $modal, $uibModal, $timeout, $modalInstance, toastr){
	
	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});

	$scope.choosePatientDialog = function(){
		var modalInstance = $modal.open({
            			animation: true,
            			templateUrl: '../../modules/appointment/views/appointmentSelectPatientModal.html',
            			controller: function($scope, $modalInstance) {
                			$scope.patient = {
                    				runIfSuccess: function(data) {
                        					$modalInstance.close({
                            					status: 'success',
                            					data: data
                        					});
                    				},
                    				runIfClose: function() {
                        					$modalInstance.close();
                    				}
                			};
            			},
		            windowClass: 'app-modal-window',
		            resolve: {
		                patientInfo: function() {
		                	return true;
		                }
		            }
        		});
		modalInstance.result.then(function(data) {
            			$scope.formData.Patient = data.data;
        		});
	}

	function getListService(){
		RosterService.GetListService()
		.then(function(response){
			$scope.listServices = response.data;
		}, function(error){

		})
	}

	function getListSite(){
		RosterService.GetListSite()
		.then(function(response){
			$scope.listSites = response.data;
		}, function(error){

		})
	}

	$scope.formData = {
		service: event.Services[0],
		site: event.Sites[0],
		fromTime: moment(start).format('HH:mm'),
		toTime: moment(end).format('HH:mm'),
		date: moment(start).format('DD/MM/YYYY'),
		Doctor: event.UserAccounts[0].Doctor,
		Patient: {
			UID: ''
		}
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};

	function appendTime(time){
		return (time < 10)?'0'+time:time;
	}

	$scope.submit = function(){

		var zone = moment().format('Z');
		var fromDate = moment(start).format('YYYY-MM-DD')+" "+appendTime($scope.formData.fromTime)+" "+zone;
		console.log(fromDate);

	};

	//INIT
	getListSite();
	getListService();
});