var app = angular.module('app.authentication.patient.create.controller', [
]);

app.controller('patientCreateCtrl', function($scope, $modal, $state, PatientService, toastr){
	console.log('patientCreateCtrl');
	$scope.er={};
	$scope.myStyle= {};
	$scope.isShowNext=false;
	$scope.Back = function() {
		$scope.isShowNext=false;
		$scope.isShowCreate=false;
	};

	$scope.checkPhone = function(data) {
		if(data.PhoneNumber!=undefined && data.PhoneNumber!=null && data.PhoneNumber!='') {
			PatientService.checkPatient(data)
			.then(function(result){
				if(result!=undefined && result!=null && result!='' && result.length!=0){
					console.log(result.data);
					if(result.data.isCheck==false){
						toastr.success("Phone number can user to create patient","SUCCESS");
						$scope.data.Email = result.data.data.Email;
						$scope.isShowNext = true;
					}
					else{
						toastr.error("Phone Number da duoc tao patient","ERROR");
					}
				}
				else{
					console.log(result.data);
				}
			}, function(err){
				toastr.error("Please input correct information","ERROR");
				console.log(err.data.message.ErrorsList);
				for(var i = 0; i < err.data.message.ErrorsList.length;i++){
					if(err.data.message.ErrorsList[i].field=="FirstName"){
						$scope.er.FirstName = {'border': '2px solid #DCA7B0'};
					}
					if(err.data.message.ErrorsList[i].field=="LastName"){
						$scope.er.LastName = {'border': '2px solid #DCA7B0'};
					}
					if(err.data.message.ErrorsList[i].field=="PhoneNumber"){
						$scope.er.PhoneNumber = {'border': '2px solid #DCA7B0'};
					}
				}
			});
		}
		else {
			toastr.error("Please input Phone Number","ERROR");
		}
	}
	//$state.go('app.authentication.patient.confirm');
});