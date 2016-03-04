var app = angular.module('app.blank.registerPatient.directives', []);
app.directive('registerPatientblank', function(AppointmentService, $modal, $cookies) {
    return {
        restrict: 'E',
        templateUrl: "modules/blank/directives/templates/registerPatient.html",
        controller: function($scope, blankServices, AuthenticationService, toastr, $state, $cookies, $rootScope, CommonService) {

    ComponentsDropdowns.init();
    $scope.number = 1;
    $scope.submitted = false;
    $scope.ListContry = [];
    $scope.logInData = {
        UserName: 'emty',
        Password: 'emty',
        UserUID: "",
        PinNumber: ""
    }
    

    $scope.postData = {
        "data": {},
        "otherData": {
            "PatientKin": {},
            "PatientMedicare": {},
            "Fund": {},
            "PatientDVA": {},
            "PatientPension": {}
        }
    }
    var checkDateUndefined = function(data) {
        if (data == ' ' || data == '' || data == undefined || data == null) {
            return false;
        }
        return true;
    };
    $scope.GetDataAppointment = function() {
        var NowDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
        $scope.dataCreateAppointment = {
            "FromTime": NowDate,
            "Type": "Telehealth",
            "RequestDate": NowDate,
            "PatientAppointment": {
                "Address1": $scope.postData.data.Address1,
                "Address2": $scope.postData.data.Address2,
                "CountryOfBirth": null,
                "DOB": $scope.postData.data.DOB,
                "PhoneNumber": $scope.postData.data.PhoneNumber,
                "Postcode": $scope.postData.data.Postcode,
                "PreferredName": $scope.postData.data.PreferredName,
                "PreviousName": $scope.postData.data.PreviousName,
                "State": $scope.postData.data.State,
                "Suburb": $scope.postData.data.Suburb,
                "Title": $scope.postData.data.Title,
                "WorkPhoneNumber": $scope.postData.data.WorkPhoneNumber,
                "Email1": $scope.postData.data.Email1,
                "Email2": $scope.postData.data.Email2,
                "FaxNumber": $scope.postData.data.FaxNumber,
                "FirstName": $scope.postData.data.FirstName,
                "Gender": $scope.postData.data.Gender,
                "HomePhoneNumber": $scope.postData.data.HomePhoneNumber,
                "Indigenous": $scope.postData.data.Indigenous,
                "InterpreterLanguage": $scope.postData.data.InterpreterLanguage,
                "InterpreterRequired": $scope.postData.data.InterpreterRequired,
                "LastName": $scope.postData.data.LastName,
                "MaritalStatus": $scope.postData.data.MaritalStatus,
                "MedicareEligible": (checkDateUndefined($scope.postData.otherData.PatientMedicare.MedicareNumber) || checkDateUndefined($scope.postData.otherData.PatientMedicare.ExpiryDate) || checkDateUndefined($scope.postData.otherData.PatientMedicare.MedicareReferenceNumber) || checkDateUndefined($scope.postData.otherData.PatientDVA.DVANumber)) ? 'Y' : 'N',
                "MedicareExpiryDate": $scope.postData.otherData.PatientMedicare.ExpiryDate,
                "MedicareNumber": $scope.postData.otherData.PatientMedicare.MedicareNumber,
                "MedicareReferenceNumber": $scope.postData.otherData.PatientMedicare.MedicareReferenceNumber,
                "MiddleName": $scope.postData.data.MiddleName,
                "OtherSpecialNeed": $scope.postData.data.OtherSpecialNeed,
                "PatientKinFirstName": $scope.postData.otherData.PatientKin.FirstName,
                "PatientKinHomePhoneNumber": $scope.postData.otherData.PatientKin.HomePhoneNumber,
                "PatientKinLastName": $scope.postData.otherData.PatientKin.LastName,
                "PatientKinMiddleName": $scope.postData.otherData.PatientKin.MiddleName,
                "PatientKinMobilePhoneNumber": $scope.postData.otherData.PatientKin.MobilePhoneNumber,
                "PatientKinRelationship": null,
                "PatientKinWorkPhoneNumber": null,
                "DVANumber": $scope.postData.otherData.PatientDVA.DVANumber
            },
            "Doctor":{
                "UID": CommonService.DoctorUID()
            }
        }
    }

    $scope.loadListContry = function() {
        AuthenticationService.getListCountry().then(function(response) {
            $scope.ListContry = response.data;
        });
    }
    $scope.loadListContry();
    $scope.Next = function(number) {
        $scope.submitted = true;
        if ($scope.step1.$valid && number == 1) {
            blankServices.checkpatient({
                PhoneNumber: $scope.postData.data.PhoneNumber
            }).then(function(response) {
                if (!response.data.isCreated) {
                    $scope.number++;
                    $scope.submitted = false;
                } else {
                    toastr.error("Mobile Phone Number exits");
                }
            }, function(err) {
                console.log(err.data.message);
            })
        } else if ($scope.step2.$valid && number == 2) {
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
    $scope.FormatDate = function() {
        if ($scope.postData.otherData.PatientPension !== undefined) {
            if ($scope.postData.otherData.PatientPension.ExpiryDate !== undefined) {
                if ($scope.postData.otherData.PatientPension.ExpiryDate !== '') {
                    $scope.postData.otherData.PatientPension.ExpiryDate = CommonService.formatDate($scope.postData.otherData.PatientPension.ExpiryDate);
                } else {
                    $scope.postData.otherData.PatientPension.ExpiryDate = null;
                };
            };
        }
        if ($scope.postData.otherData.PatientMedicare !== undefined) {
            if ($scope.postData.otherData.PatientMedicare.ExpiryDate !== undefined) {
                if ($scope.postData.otherData.PatientMedicare.ExpiryDate !== '') {
                    $scope.postData.otherData.PatientMedicare.ExpiryDate = CommonService.formatDate($scope.postData.otherData.PatientMedicare.ExpiryDate);
                } else {
                    $scope.postData.otherData.PatientMedicare.ExpiryDate = null;
                };
            };
        }
    }
    $scope.Submit = function() {
        $scope.submitted = true;
        if ($scope.step3.$valid) {
            $scope.FormatDate();
            $scope.GetDataAppointment();
            console.log("$scope.dataCreateAppointment",$scope.dataCreateAppointment)
            blankServices.registerPatient($scope.postData).then(function(response) {
                console.log("registerPatient", response)
                if (response.data.status = 200) {
                    $scope.logInData.UserUID = response.data.UserAccountUID;
                    $scope.logInData.PinNumber = $scope.postData.data.PinNumber;
                    blankServices.login($scope.logInData).then(function(response) {
                        console.log("login", response)
                        $cookies.putObject("userInfo", response.user);
                        $cookies.put("token", response.token);
                        $rootScope.refreshCode = response.refreshCode;
                        blankServices.PatientRequestAppointment($scope.dataCreateAppointment).then(function(response) {
                            $state.go("authentication.home.list")
                        }, function(err) {
                            $state.go("authentication.home.list")
                            toastr.error('Request Appointment fail');
                        })
                    }, function(err) {
                        toastr.error('Patient login fail');
                    })
                };
            }, function(err) {
                toastr.error('Create Patient fail');
            })
        }
    };
        }
    };
})
