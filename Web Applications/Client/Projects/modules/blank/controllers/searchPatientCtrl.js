var app = angular.module('app.blank.searchPatient.controller', []);
app.controller('searchPatientCtrl', function($scope,blankServices,toastr) {
	$scope.number = 1;
	$scope.submitted = false;
	 $scope.postData = {
	        "data": {
	            "FirstName": "Ben",
	            "LastName": "Harris",
	            "DOB": "25/11/2015",
	            "Gender": "Female",
	            "PhoneNumber": "0432112352",
	            "Email1": "benharris@gmail.com",
	        }
        }
    $scope.Reset = function(){
    	 $scope.postData.data = {}
    	 $scope.submitted = false;
    }
	$scope.next = function(){
		$scope.submitted = true;
		if($scope.step1.$valid){
			 blankServices.searchPatient($scope.postData.data).then(function(response) {
            	if (response.data.status = 200) {
            		$scope.number++;
					$scope.submitted = false;
            		toastr.success('success');
            	}else{
            		toastr.error('fail');
            	};
            },function(err){
            	toastr.error('fail');
            })
		}
	};
	$scope.Back = function(){
		$scope.submitted = false;
		if($scope.step2.$valid || $scope.step2.$valid){
			$scope.number--;
		}
	};
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.step2.$valid)
			alert('success');
	};
});