var app = angular.module('app.authentication.patient.checkPhone.controller', [
]);

app.controller('patientCheckPhoneCtrl', function($scope, $modal, PatientService, toastr){
	console.log('patientCheckPhoneCtrl');
	$scope.checkPhone = function(data) {
		console.log(data);
		if(data.PhoneNumber!=undefined && data.PhoneNumber!=null && data.PhoneNumber!='') {
			PatientService.checkPatient(data)
			.then(function(result){
				if(result!=undefined && result!=null && result!='' && result.length!=0){
					//check patientservices
				}
				else{
					console.log("huhu");
				}
			}, function(err){
				toastr.error(err,"ERROR");
				console.log(err);
			});
		}
		else {
			toastr.error("Please input Phone Number");
		}
	}
});