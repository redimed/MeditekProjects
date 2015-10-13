var app = angular.module('app.authentication.patient.checkPhone.controller', [
]);

app.controller('patientCheckPhoneCtrl', function($scope, $modal, PatientService, toastr, $state){
	console.log('patientCheckPhoneCtrl');
	$scope.checkPhone = function(data) {
		if(data.PhoneNumber!=undefined && data.PhoneNumber!=null && data.PhoneNumber!='') {
			PatientService.checkPatient(data)
			.then(function(result){
				if(result!=undefined && result!=null && result!='' && result.length!=0){
					//check patientservices
					// "authentication.patient.create"
					console.log(result.data);
					if(result.data==false){
						toastr.success("Phone number can user to create account","SUCCESS");
						$state.go('authentication.patient.create');
					}
					else{
						toastr.error("Phone Number da duoc tao useraccount","ERROR");
					}
				}
				else{
					console.log(result.data);
				}
			}, function(err){
				toastr.error(err,"ERROR");
				console.log(err);
			});
		}
		else {
			toastr.error("Please input Phone Number","ERROR");
		}
	}
});