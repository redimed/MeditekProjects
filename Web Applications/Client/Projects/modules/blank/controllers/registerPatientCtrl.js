var app = angular.module('app.blank.registerPatient.controller', []);
app.controller('registerPatientCtrl', function($scope, blankServices, AuthenticationService, toastr, $state, $cookies, $rootScope, CommonService) {
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
        "data": {
            "State": "WA",
            "CountryID1": 14,
            "Title": "Ms",
            "FirstName": "123",
            "LastName": "123",
            "HomePhoneNumber": "0412111113",
            "PhoneNumber": "0412117812",
            "WorkPhoneNumber": "0412111113",
            "Address1": "123123",
            "Suburb": "123123",
            "Postcode": "1234",
            "MiddleName": "123",
            "DOB": "23/02/2016",
            "Gender": "Male",
            "Occupation": "123",
            "Email1": "test@yahoo.com",
            "Address2": "123"
        },
        "otherData": {
            "PatientKin": {
                "State": "WA",
                "CountryID": 14,
                "FirstName": "123",
                "LastName": "123",
                "HomePhoneNumber": "0412111113",
                "MobilePhoneNumber": "0412111113",
                "Address1": "123123",
                "Suburb": "123123",
                "Postcode": "1234",
                "MiddleName": "123"
            },
            "PatientMedicare": {
                "MedicareNumber": "123",
                "MedicareReferenceNumber": "123",
                "ExpiryDate": "04/02/2016"
            },
            "Fund": {
                "MembershipNumber": "123",
                "UPI": "123",
                "PrivateFund": "LHS"
            },
            "PatientDVA": {
                "DVANumber": "123",
                "DVADisability": "123",
                "DVACardColour": "yellow"
            },
            "PatientPension": {
                "HCCPensionNumber": "HCC/Pension No",
                "ExpiryDate": "02/02/2016"
            }
        }
    }
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
            "MedicareEligible": $scope.postData.otherData.PatientMedicare.MedicareEligible,
            "MedicareExpiryDate": $scope.postData.otherData.PatientMedicare.MedicareExpiryDate,
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
            console.log($scope.postData)
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
                            console.log("PatientRequestAppointment", response)
                            $state.go("authentication.home.list")
                        }, function(err) {
                            toastr.error('Patient login fail');
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
});
