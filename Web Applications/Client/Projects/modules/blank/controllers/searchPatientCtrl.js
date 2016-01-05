var app = angular.module('app.blank.searchPatient.controller', []);
app.controller('searchPatientCtrl', function($scope,blankServices,toastr,UnauthenticatedService,$rootScope, $state, $cookies) {
	$scope.number = 1;
	$scope.submitted = false;
	$scope.logInData = {
				UserName:'emty',
				Password:'emty',
				UserUID : "",
				PinNumber:""
			}
	// $scope.postData = {
	//        "data": {
	//             "FirstName": "tsubasa",
	//             "LastName": "123123",
	//             "DOB": "23/12/2015",
	//             "Gender": "Female",
	//             "PhoneNumber": "0412112112",
	//             "Email1": "test@yahoo.com",
	//        }
    //          }
    $scope.Reset = function(){
    	 $scope.postData.data = {}
    	 $scope.submitted = false;
    }
	$scope.next = function(){
		$scope.submitted = true;
		if($scope.step1.$valid){
			 blankServices.searchPatient($scope.postData.data).then(function(response) {
            	if (response.data.status = 200) {
					if(!response.data[0]){
						$scope.logInData.UserUID = response.data.UserAccount.UID;
						toastr.success('success');
						$scope.number++;
						$scope.submitted = false;
					}else{
						toastr.error('Not found Patient');
					};
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
		if($scope.step1.$valid || $scope.step2.$valid){
			$scope.number--;
		}
	};
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.step2.$valid){
			$scope.logInData.PinNumber = $scope.postData.data.PinNumber
			console.log($scope.logInData)
			blankServices.login($scope.logInData).then(function(response){
				 $cookies.putObject("userInfo", response.user);
                 $cookies.put("token", response.token);
                 $rootScope.refreshCode=response.refreshCode;
				 $state.go("authentication.home.list")
			},function(err){
            	toastr.error('fail');
            })
		}
	};
});