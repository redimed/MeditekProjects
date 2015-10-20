var app = angular.module('app.authentication.appointment.list.modal.controller', [
]);

app.controller('appointmentListModalCtrl', function($scope, $modal, $modalInstance,getid,AppointmentService,CommonService){


	$scope.modal_close = function(){
		$modalInstance.close();
	};
	$scope.close = function(){
		$modalInstance.close();
	};
	$scope.tab_body_part = 'all';
	$scope.DateTimeAppointmentDate = null
	$scope.DateTimeAppointmentDateTime = null
	$scope.appointment = null
	$scope.PatientsFullName = null
	var ClinicalDetails = CommonService.GetClinicalDetails();
	var listDoctor = CommonService.GetNamDoctor()
	var load = function(){
		AppointmentService.getDetailApppointment(getid).then(function(response){
			$scope.appointment = angular.copy(response.data);
                  $scope.patientDOBTemp = moment($scope.appointment.TelehealthAppointment.PatientAppointment.DOB).format("DD/MM/YYYY");
                  $scope.referringPractitionerDateTemp = moment($scope.appointment.Doctors.RefDate).format("DD/MM/YYYY");
			 if(response.data.RequestDate){
                  $scope.appointment.RequestDate = moment(response.data.RequestDate).format('DD/MM/YYYY');
            }
            if(response.data.FromTime){
             	var DateTime = response.data.FromTime;
                $scope.DateTimeAppointmentDate = moment(DateTime).format('DD/MM/YYYY');
                $scope.DateTimeAppointmentDateTime = moment(DateTime).format('H:mm:ss A');
            }
           
            if($scope.appointment.TelehealthAppointment.PatientAppointment !== undefined){
             $scope.PatientsFullName = $scope.appointment.TelehealthAppointment.PatientAppointment.FirstName + ' ' + $scope.appointment.TelehealthAppointment.PatientAppointment.LastName
            }


           
       		ClinicalDetails.forEach(function(valueInit,indexInit){
       			$scope.appointment.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes,indexRes){
       				if(valueInit.Type == valueRes.Type && 
       				   valueInit.Name == valueRes.Name &&
       				   valueInit.Section == valueRes.Section &&
       				   valueInit.Category == valueRes.Category)
       				{
       					valueInit.Value = valueRes.Value
       					valueInit.ClinicalNote = valueRes.ClinicalNote
       				}
       			})
       		});
       		listDoctor.forEach(function(valueInit,indexInit){
       			$scope.appointment.TelehealthAppointment.PreferedPlasticSurgeons.forEach(function(valueRes,indexRes){
       				if(valueInit.Name == valueRes.Name)
       				{
       					valueInit.Value = 'Y'
       				}
       			})
       		})
       	$scope.appointment.TelehealthAppointment.PreferedPlasticSurgeons = angular.copy(listDoctor);
		$scope.appointment.TelehealthAppointment.ClinicalDetails = angular.copy(ClinicalDetails);
		});

            
	}
	$scope.appointment = {
		load: function(){load();}
	}
	$scope.appointment.load();

});
