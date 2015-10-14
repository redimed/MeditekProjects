var app = angular.module('app.authentication.patient.create.controller', [
]);

app.controller('patientCreateCtrl', function($scope, $modal, $state, PatientService, toastr){
	console.log('patientCreateCtrl');
	$scope.er={};
	$scope.isShowNext=false;
	$scope.isBlockStep1 =false;
	$scope.Back = function() {
		$scope.isShowNext=false;
		$scope.isShowCreate=false;
	};

	$scope.checkPhone = function(data) {
		return $scope.validateCheckPhone(data)
		.then(function(success){
			$scope.er ='';
			$scope.isBlockStep1=true;
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
					$scope.er[err.data.message.ErrorsList[i].field] = {'border': '2px solid #DCA7B0'};
				}
			});
		},function (err){
			console.log(err);
			toastr.error("Please check data again.","ERROR");
			$scope.er ={};
			for(var i = 0; i < err.length; i++){
				$scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
			}
		});
		
	};

	$scope.Cancel = function() {
		$state.go('authentication.patient.list');
	}
	//$state.go('app.authentication.patient.confirm');
});