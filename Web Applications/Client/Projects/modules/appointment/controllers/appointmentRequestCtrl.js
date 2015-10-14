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
				Section:
			}]
		}


	}


	console.log($cookies.getObject('userInfo'));
	$scope.sendRequestAppointment = function() {
		
	}
});