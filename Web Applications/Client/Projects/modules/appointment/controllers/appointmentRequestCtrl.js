var app = angular.module('app.authentication.appointment.request.controller',[]);

app.controller('appointmentRequestCtrl', function($scope,$cookies){

	$scope.requestInfo = {
		RequestDate:null,
		TelehealthAppointment : {
			RefDurationOfReferal : null,
			PatientAppointment : {
				FirstName : null,
				MiddleName : null,
				LastName : null,
				DOB : null,
				Email : null,
				PhoneNumber : null,
				Address : null,
				Suburb : null,
				Postcode : null,
				HomePhoneNumber : null
			},
			ExaminationRequired : {
				Private : null,
				Public : null,
				DVA : null,
				WorkersComp : null,
				MVIT : null
			},
			PreferedPlasticSurgeon : {
				Name : null
			},
			ClinicalDetails : [{
				Section:null
			}]
		} 
	}
	$scope.checkElectiveOther = false;
	$scope.checkLacerationsOther = false;
	$scope.checkPNSOther = false;

	$scope.checkboxOther = function(){
		if($scope.checkLacerationsOther == false){
			$scope.txtLacerationsOther = null;
		}
		if($scope.checkElectiveOther == false){
			$scope.txtElectiveOther = null;
		}
		if($scope.checkPNSOther == false){
			$scope.txtPNSOther = null;
		}
	};

	console.log($cookies.getObject('userInfo'));
	$scope.sendRequestAppointment = function() {
		
	}
});