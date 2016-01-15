var app = angular.module('app.blank.registerPatient.controller', []);
app.controller('registerPatientCtrl', function($scope, blankServices, AuthenticationService, toastr,$state) {
    ComponentsDropdowns.init();
    $scope.number = 1;
    $scope.submitted = false;
    $scope.ListContry = [];
    // $scope.postData = {
    //     "data": {
    //         "Title": "Ms",
    //         "FirstName": "test1",
    //         "MiddleName": "anime",
    //         "LastName": "123123",
    //         "DOB": "23/12/2015",
    //         "Gender": "Female",
    //         "Occupation": "Occupation",
    //         "Address1": "Occupation",
    //         "HomePhoneNumber": "0411223344",
    //         "PhoneNumber": "0412112112",
    //         "WorkPhoneNumber": "0411223344",
    //         "Suburb": "123123",
    //         "Postcode": "1233",
    //         "State": "WA",
    //         "CountryID1": 5,
    //         "Email1": "test@yahoo.com",
    //         "Address2": "Occupation"
    //     },
    //     "otherData": {
    //         "PatientKin": {
    //             "FirstName": "maria",
    //             "MiddleName": "ama",
    //             "LastName": "ozawa",
    //             "HomePhoneNumber": "0411223344",
    //             "MobilePhoneNumber": "0411111111",
    //             "Address1": "Address",
    //             "Suburb": "Suburb",
    //             "Postcode": "1234",
    //             "State": "WA",
    //             "CountryID": "1"
    //         },
    //         "PatientMedicare": {
    //             "MedicareNumber": "1",
    //             "MedicareReferenceNumber": "1",
    //             "ExpiryDate": "01/12/2015"
    //         },
    //         "Fund": {
    //             "MembershipNumber": "1",
    //             "UPI": "1",
    //             "PrivateFund": "ACA"
    //         },
    //         "PatientDVA": {
    //             "DVANumber": "1",
    //             "DVADisability": "1"
    //         },
    //         "PatientPension": {
    //             "ExpiryDate": "01/12/2015",
    //             "HCCPensionNumber": "HCC/Pension No"
    //         }
    //     }
    // }
    $scope.loadListContry = function() {
            AuthenticationService.getListCountry().then(function(response) {
                $scope.ListContry = response.data;
            });
        }
    $scope.loadListContry();
    $scope.Next = function(number) {
        $scope.submitted = true;
        if ($scope.step1.$valid && number == 1) {
               blankServices.checkpatient({PhoneNumber:$scope.postData.data.PhoneNumber}).then(function(response){
               	console.log(response.data.isCreated);
               	if(!response.data.isCreated){
                        $scope.number++;
                        $scope.submitted = false;
                   }else{
                       toastr.error("Phone Number exits");
                   }
               },function(err){
            	console.log(err.data.message);
            })
        }
        if ($scope.step2.$valid && number == 2) {
            $scope.number++;
            $scope.submitted = false;
            if ($scope.NextOfKin == 'N') {
                if ($scope.postData.otherData.PatientKin) {
                    $scope.postData.otherData.PatientKin = {};
                };
            };
        }
    };
    $scope.Back = function() {
        $scope.submitted = true;
        if ($scope.step1.$valid || $scope.step2.$valid) {
            $scope.number--;
        }
    };
    $scope.Submit = function() {
        $scope.submitted = true;
        if ($scope.step3.$valid) {
            console.log('data register Patient', $scope.postData)
            blankServices.registerPatient($scope.postData).then(function(response) {
                console.log('1',response);
            	if (response.data.status = 200) {
            		toastr.success('create Patient success');
                    $state.go('blank.welcome')
            	};
            },function(err){
            	toastr.error('create Patient fail');
            })
        }
    };
});
