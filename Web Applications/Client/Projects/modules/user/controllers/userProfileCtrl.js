var app = angular.module('app.authentication.user.profile.controller',[
]);

app.controller('userProfileCtrl', function($scope, PatientService, doctorService, $cookies){
	$scope.isShow=true;
	$scope.listDoctor = {
		columm2 : true,
		columm3 : true,
		columm4 : true
	};

	$scope.listPatient = {
		columm1 : true,
		columm2 : true,
		columm3 : true
	};

	var data ={
		// UID : "a75b5a3f-f3c4-4b2b-9eab-95f6a798aacd",
		UID : $cookies.getObject("userInfo").UID,
		attributes: [
			{field:"UID"}
		]
	};
	
	var userprofile = $cookies.getObject("userprofile");

	if(userprofile.patient!=null){
		PatientService.getPatient(data).then(function(response){
			if(response.message=="Success"){
				$scope.patientUID = response.data[0].UID;
			}
			else
				$scope.patientUID = null;
		},function(err){
			$scope.patientUID = null;
		});
	}
	if(userprofile.doctor!=null){
		doctorService.getDoctor(data).then(function(response){
			$scope.data = response.data;
		},function(err){
			console.log(err);
		});
	}
});