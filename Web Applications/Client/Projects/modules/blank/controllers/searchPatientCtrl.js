var app = angular.module('app.blank.searchPatient.controller', []);
app.controller('searchPatientCtrl', function($scope, blankServices, toastr, UnauthenticatedService, $rootScope, $state, $cookies, $stateParams, $timeout) {
    console.log('$stateParams',$stateParams.typePatient);
    $timeout(function(){
        if($stateParams.typePatient == 'PatientCampaign')
            document.body.className = "full-background-compaign";
        else
            document.body.className = "full-background";
    },0);
   if ($stateParams.typePatient == 'PatientCampaign') {
     $scope.typePatient = $stateParams.typePatient
   };
    $scope.number = 1;
    $scope.submitted = false;
    $scope.logInData = {
        UserName: 'emty',
        Password: 'emty',
        UserUID: "",
        PinNumber: ""
    }
    $scope.Reset = function() {
        $state.go('blank.searchPatient',{},{reload:true});
        // $scope.postData.data = {}
        // $scope.submitted = false;
    }
    $scope.next = function() {
        $scope.submitted = true;
        if ($scope.step1.$valid) {
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
            delete $scope.postData.data['PinNumber'];
            $scope.submitted = false;
            $scope.number--;
        }
    };
    $scope.submit = function() {
        $scope.submitted = true;
         o.loadingPage(true);
        if ($scope.step2.$valid) {
            $scope.logInData.PinNumber = $scope.postData.data.PinNumber
            blankServices.login($scope.logInData).then(function(response) {
                console.log("response", response)
                o.loadingPage(false);
                $cookies.putObject("userInfo", response.user);
                $cookies.put("token", response.token);
                $rootScope.refreshCode = response.refreshCode;
                $state.go("authentication.home.list")
            }, function(err) {
                 o.loadingPage(false);
                if (err.data.ErrorType == "PinNumber.Invalid") {
                    toastr.error('PinNumber Invalid');
                } else if (err.data.ErrorType == "PinNumber.Expired") {

                    toastr.error('PinNumber Expired');
                } else {
                    toastr.error('Patient Login Fail');
                }
                $state.go('blank.searchPatient')
            })
        }
    };
});
