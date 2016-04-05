var app = angular.module('app.blank.registerPatientBlank.directive', []);
app.directive('registerPatientblank', function(AppointmentService, $modal, $cookies, consultationServices) {
    return {
        restrict: 'E',
        scope: {
            typedoctor: '='
        },
        templateUrl: "modules/blank/directives/templates/registerPatientBlank.html",
        controller: function($scope, blankServices, AuthenticationService, toastr, $state, $cookies, $rootScope, CommonService, $timeout) {
            $timeout(function() {
                App.initAjax();
                ComponentsDateTimePickers.init();
                $.uniform.update();
            }, 0);
            $scope.NextOfKin = "Y"
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
                    "Gender":"Male"
                },
                "otherData": {
                    "PatientKin": {},
                    "PatientMedicare": {},
                    "Fund": {},
                    "PatientDVA": {},
                    "PatientPension": {}
                }
            };
            // $scope.postData = {
            //   "data": {
            //     "Gender": "Male",
            //     "State": "WA",
            //     "CountryID1": 14,
            //     "Title": "Master",
            //     "FirstName": "123",
            //     "LastName": "123",
            //     "DOB": "03/04/2016",
            //     "PhoneNumber": "0412312318",
            //     "Address1": "13123",
            //     "Suburb": "1234",
            //     "Postcode": "1234"
            //   },
            //   "otherData": {
            //     "PatientKin": {
            //       "State": "WA",
            //       "CountryID": 14,
            //       "FirstName": "1",
            //       "LastName": "1",
            //       "MobilePhoneNumber": "0412345677",
            //       "Address1": "13123",
            //       "Suburb": "1234",
            //       "Postcode": "1234"
            //     },
            //     "PatientMedicare": {
                  
            //     },
            //     "Fund": {
                  
            //     },
            //     "PatientDVA": {
                  
            //     },
            //     "PatientPension": {
                  
            //     }
            //   }
            // };
            var checkDateUndefined = function(data) {
                if (data == ' ' || data == '' || data == undefined || data == null) {
                    return false;
                }
                return true;
            };
            $scope.AppointmentDataPost = []
            $scope.AppointmentData = function() {
                console.log($scope.AppointmentData)
                var AppointmentDataTemp = []
                    for (var key in $scope.AppointmentData) {

                        var newkey = key.split("__").join(" ");
                        var res = newkey.split(".");
                        var keyOtherRequest = res[2] + res[3];
                        keyOtherRequest = keyOtherRequest.split(" ").join("");
                        var object = {
                            Section: res[0],
                            Category: res[1],
                            Type: res[2],
                            Name: res[3],
                            Value: $scope.AppointmentData[key].Value
                        }

                        var isExist = false;

                        AppointmentDataTemp.forEach(function(valueTemp, keyTemp) {
                            if (valueTemp !== undefined) {
                                if (valueTemp.Section == object.Section &&
                                    valueTemp.Category == object.Category &&
                                    valueTemp.Type == object.Type &&
                                    valueTemp.Name == object.Name) {
                                    isExist = true;
                                }
                            } else {
                                isExist = true;
                            };

                        })
                        if (!isExist) {
                            AppointmentDataTemp.push(object);
                        };
                    };
                    var countCliniDetail = 0;
                    AppointmentDataTemp.forEach(function(value, key) {
                        if (value !== undefined) {
                            if (value.Value != 'N' && value.Value != null) {
                                countCliniDetail++;
                            };
                        };
                    })
                    if (countCliniDetail == 0) {
                        AppointmentDataTemp = [];
                    }
                   $scope.AppointmentDataPost = angular.copy(AppointmentDataTemp)
                   console.log($scope.AppointmentDataPost)
                }
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
                    "AppointmentData":$scope.AppointmentDataPost,
                    "Doctor": {
                        "UID": null
                    }
                }
                console.log($scope.dataCreateAppointment)
                if ($scope.typedoctor == 'typedoctor') {
                    consultationServices.getDoctorCampaign('Campaign01').then(function(response) {
                        console.log('Campaign01',response)
                        $scope.dataCreateAppointment.Doctor.UID = response.data.Value;
                        blankServices.PatientRequestAppointment($scope.dataCreateAppointment).then(function(response) {
                            o.loadingPage(false);
                            $state.go("authentication.home.list")
                        }, function(err) {
                            o.loadingPage(false);
                            $state.go("authentication.home.list")
                            toastr.error('Request Appointment fail');
                        })
                    }, function(err) {
                        o.loadingPage(false);
                        $state.go("authentication.home.list")
                        toastr.error('Set campaign doctor for Appointment fail');
                    })
                }else{
                    $scope.dataCreateAppointment.Doctor = null;
                    console.log("$scope.dataCreateAppointment",$scope.dataCreateAppointment);
                    blankServices.PatientRequestAppointment($scope.dataCreateAppointment).then(function(response) {
                        o.loadingPage(false);
                        $state.go("authentication.home.list")
                    }, function(err) {
                        o.loadingPage(false);
                        $state.go("authentication.home.list")
                        toastr.error('Request Appointment fail');
                    })
                };
            }
            $scope.loadListContry = function() {
                AuthenticationService.getListCountry().then(function(response) {
                    $scope.ListContry = response.data;
                });
            }
            $scope.loadListContry();
            $scope.Next = function(number) {
                o.loadingPage(true);
                $scope.submitted = true;
                var isEmail = false;
                var isPhoneNumber = false;
                var data = '?';
                $('#btn2').prop('disabled',true);
                if ($scope.step1.$valid && number == 1) {
                    if($scope.postData.data.PhoneNumber) {
                        data = data+'&PhoneNumber='+$scope.postData.data.PhoneNumber;
                    }
                    if($scope.postData.data.Email1) {
                        data = data+'&Email='+$scope.postData.data.Email1;
                    }
                    blankServices.checkpatient(data).then(function(response) {
                        if(response == null || response == '' || response.length == 0) {
                            $scope.number++;
                            $scope.submitted = false;
                            o.loadingPage(false);
                            $('#btn2').prop('disabled',false);
                        }
                        else { 
                            o.loadingPage(false);
                            if($scope.postData.data.PhoneNumber.indexOf('0') == 0){
                                var parsePhone = $scope.postData.data.PhoneNumber.substr(0, 0)+"+614"+$scope.postData.data.PhoneNumber.substr(2);
                            }
                            for(var i = 0; i <= response.length; i++) {
                                if(i == response.length) {
                                    if(isEmail == true && isPhoneNumber == true) {
                                        toastr.error("Mobile Phone Number and Email existed");
                                    }
                                    else if(isEmail == true) {
                                        toastr.error("Email existed");
                                    }
                                    else if(isPhoneNumber == true) {
                                        toastr.error("Mobile Phone Number existed");
                                    }
                                }
                                else {
                                    if(response[i].Email == $scope.postData.data.Email1) {
                                        isEmail = true;
                                        // toastr.error("Email existed");
                                    }
                                    if(response[i].PhoneNumber == parsePhone) {
                                        isPhoneNumber = true;
                                        // toastr.error("Mobile Phone Number existed");
                                    }
                                }
                            }
                        }
                        // if (!response.data.isCreated) {
                        //     $scope.number++;
                        //     $scope.submitted = false;
                        // } else {
                        //     if(response.data.field.Email == true && response.data.field.PhoneNumber == true) {
                        //         toastr.error("Mobile Phone Number and Email existed");
                        //     }
                        //     else if(response.data.field.Email == true) {
                        //         toastr.error("Email existed");
                        //     }
                        //     else if(response.data.field.PhoneNumber == true) {
                        //         toastr.error("Mobile Phone Number existed");
                        //     }

                        // }
                    }, function(err) {
                        o.loadingPage(false);
                        console.log(err.data.message);
                    })
                } else if ($scope.step2.$valid && number == 2) {
                    o.loadingPage(false);
                    $scope.number++;
                    $scope.submitted = false;
                    $('#btn2').prop('disabled',false);
                    if ($scope.NextOfKin == 'N') {
                        if ($scope.postData.otherData.PatientKin) {
                            $scope.postData.otherData.PatientKin = {};
                        };
                    };
                }
                else if ($scope.step2.$invalid) {
                    $('#btn2').prop('disabled',false);
                    o.loadingPage(false);
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
                    if($scope.postData) {
                        for(var key in $scope.postData) {
                            if($scope.postData[key]== null || $scope.postData[key]=='') {
                                delete $scope.postData[key];
                            }
                        }
                    }
                    $scope.AppointmentData();
                    $scope.FormatDate();
                    o.loadingPage(true);
                    blankServices.registerPatient($scope.postData).then(function(response) {
                        if (response.data.status = 200) {
                            $scope.logInData.UserUID = response.data.UserAccountUID;
                            $scope.logInData.PinNumber = $scope.postData.data.PinNumber;
                            blankServices.login($scope.logInData).then(function(response) {
                                $cookies.putObject("userInfo", response.user);
                                $cookies.put("token", response.token);
                                $rootScope.refreshCode = response.refreshCode;
                                $scope.GetDataAppointment();
                            }, function(err) {
                                o.loadingPage(false);
                                toastr.error('Patient login fail');
                            })
                        };
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error('Create Patient fail');
                    })
                }
            };
        }
    };
})
