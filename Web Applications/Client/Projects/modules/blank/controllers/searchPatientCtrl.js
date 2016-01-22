var app = angular.module('app.blank.searchPatient.controller', []);
app.controller('searchPatientCtrl', function($scope, blankServices, toastr, UnauthenticatedService, $rootScope, $state, $cookies) {
    $scope.number = 1;
    $scope.submitted = false;
    $scope.logInData = {
        UserName: 'emty',
        Password: 'emty',
        UserUID: "",
        PinNumber: ""
    }
    // $scope.postData = {
    //     "data": {
    //         "FirstName": "maria",
    //         "LastName": "ozawa",
    //         "DOB": "23/12/2015",
    //         "Gender": "Female",
    //         "PhoneNumber": "0401101109",
    //         "Email1": "test@yahoo.com",
    //     }
    // }
    $scope.Reset = function() {
        $scope.postData.data = {}
        $scope.submitted = false;
    }
    $scope.next = function() {
        if ($scope.step1.$valid) {
            $scope.submitted = true;
            blankServices.searchPatient($scope.postData.data).then(function(response) {
                if (response.data.length != 0) {
                    toastr.success('success');
                    $scope.logInData.UserUID = response.data.UserAccount.UID;
                    $scope.number++;
                    $scope.submitted = false;
                } else {
                    toastr.error('Not found Patient');
                };
            }, function(err) {
                toastr.error('Search Patient Fail');
            })
        }
    };
    $scope.Back = function() {
        if ($scope.step1.$valid || $scope.step2.$valid) {
            $scope.submitted = false;
            $scope.number--;
        }
    };
    $scope.submit = function() {
        $scope.submitted = true;
        if ($scope.step2.$valid) {
            $scope.logInData.PinNumber = $scope.postData.data.PinNumber
            console.log($scope.logInData)
            blankServices.login($scope.logInData).then(function(response) {
                $cookies.putObject("userInfo", response.user);
                $cookies.put("token", response.token);
                $rootScope.refreshCode = response.refreshCode;
                $state.go("authentication.home.list")
            }, function(err) {
                toastr.error('Patient Login Fail');
            })
        }
    };
});
