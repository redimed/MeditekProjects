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

	$scope.listTypes = [
		{code: 'Onsite', name: 'Onsite'},
		{code: 'Telehealth', name: 'Telehealth'}
	];
	$scope.formData = {
		service: event.Services[0],
		site: event.Sites[0],
		fromTime: moment(start).format('HH:mm'),
		toTime: moment(end).format('HH:mm'),
		date: moment(start).format('DD/MM/YYYY'),
		Doctor: event.UserAccounts[0].Doctor,
		Patient: {
			UID: ''
		},
		type: 'Onsite'
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
		var zone = moment().format('Z');
		return moment(date).format('YYYY-MM-DD')+' '+hour+':'+minute+':00 '+zone;
	}

	$scope.submit = function(){
		var fromTime = appendFullCalendarDateTime(start, $scope.formData.fromTime);
		var toTime = appendFullCalendarDateTime(start, $scope.formData.toTime);
		var type = $scope.formData.type;
		var requestDate = moment(start).format('YYYY-MM-DD HH:mm:ss Z');
		var serviceUID = event.Services[0].UID;
		var siteUID = event.Sites[0].UID;
		var DoctorUID = event.UserAccounts[0].Doctor.UID;
		var PatientUID = $scope.formData.Patient.UID;

		var postData = {
			Appointment: {
				FromTime: fromTime,
				ToTime: toTime,
				Type: type,
				RequestDate: requestDate
			},
			Service: {
				UID: serviceUID
			},
			Site: {
				UID: siteUID
			},
			Doctor: {
				UID: DoctorUID
			},
			Patient: {
				UID: PatientUID
			}
		}

		BookingService.CreateBooking(postData)
		.then(function(response){
			console.log(response);
		}, function(error){

		})

	};

	//INIT
	getListSite();
	getListService();
});