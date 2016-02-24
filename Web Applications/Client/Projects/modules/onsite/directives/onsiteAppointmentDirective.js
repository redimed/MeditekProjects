var app = angular.module('app.authentication.onsite.appointment.directive',[]);

app.directive('onsiteAppointment', function(AuthenticationService, $state, $cookies, WAAppointmentService, toastr, $modal, PatientService, CommonService, $stateParams){
	return {
		restrict: 'E',
		templateUrl: 'modules/onsite/directives/templates/onsiteAppointmentDirective.html',
		link: function(scope, elem, attrs){
			 o.loadingPage(true);
            WAAppointmentService.getDetailWAAppointmentByUid($stateParams.UID).then(function(data) {
                scope.wainformation = data.data;
                runAll()
                o.loadingPage(false);
            }, function(error) {});

            var runAll = function() {
                scope.loadListContry = function() {
                    AuthenticationService.getListCountry().then(function(response) {
                        scope.ListContry = response.data;
                    })
                }
                scope.ShowData = {
                    isLinkPatient: false,
                    patient: []
                };
                var checkDateUndefined = function(data) {
                    if (data == ' ' || data == '' || data == undefined) {
                        return false;
                    }
                    return true;
                };
                scope.loadListContry();
                scope.submited = false;
                scope.ViewDoc = function(Url, UID) {
                    var LinkUID = Url + UID;
                    CommonService.downloadFile(UID)
                        .then(function(data) {
                            console.log(data);
                        }, function(er) {
                            console.log(er);
                        })
                }
                console.log("data---->", scope.wainformation)
                scope.FileUploadImage = []
                scope.FileUploads = function() {
                    scope.FileUploadImage = angular.copy(scope.wainformation.FileUploads)
                    if (scope.wainformation.TelehealthAppointment !== null) {
                        for (var key in scope.wainformation.TelehealthAppointment.ClinicalDetails) {
                            scope.FileUploadImage = scope.FileUploadImage.concat(scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads)
                        }
                    };
                }
                scope.FileUploads()
                scope.tab_body_part = 'all';
                scope.checkRoleUpdate = true;
                if ($cookies.getObject('userInfo').roles[0].RoleCode == 'ADMIN' || $cookies.getObject('userInfo').roles[0].RoleCode == 'ASSISTANT' || $cookies.getObject('userInfo').roles[0].RoleCode == 'INTERNAL_PRACTITIONER') {
                    scope.checkRoleUpdate = false;
                };
                scope.Temp = angular.copy(scope.wainformation)
                var ClinicalDetailsTemp = [];
                scope.loadFuntion = function() {
                    if (scope.wainformation.Patients.length != 0) {
                        scope.ShowData.isLinkPatient = true;
                        if (checkDateUndefined(scope.wainformation.Patients[0])) {
                            scope.ShowData.patient = angular.copy(scope.wainformation.Patients[0]);
                            scope.ShowData.patient.PhoneNumber = scope.ShowData.patient.UserAccount.PhoneNumber;
                        };
                    } else {
                        scope.ShowData.patient = scope.wainformation.TelehealthAppointment.PatientAppointment;
                    }
                    if (scope.wainformation.TelehealthAppointment != null || scope.wainformation.TelehealthAppointment != undefined) {
                        scope.wainformation.TelehealthAppointment.ClinicalDetails = {}
                        scope.Temp.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes, indexRes) {
                            if (valueRes != null && valueRes != undefined) {
                                var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name;
                                keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                                var keyOther = valueRes.Type + valueRes.Name;
                                if (keyOther != 0) {
                                    keyOther = keyOther.split(" ").join("");
                                }
                                scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail] = {};
                                scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].Value = valueRes.Value;
                                scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                                scope[valueRes.Name] = 'Yes';
                                if (valueRes.Name == 'OThers' || valueRes.Name == 'Other') {
                                    scope[keyOther] = 'Yes';
                                }
                            }
                        })
                    };

                }
                scope.loadFuntion();
                if (scope.wainformation.TelehealthAppointment !== null) {
                    scope.info = {
                        apptStatus: WAConstant.apptStatus,
                        listDoctorTreatingPractitioner: null,
                        patientInfomation: (scope.wainformation.Patients.length != 0) ? scope.wainformation.Patients : scope.wainformation.TelehealthAppointment.PatientAppointment,
                        appointmentDate: (scope.wainformation.FromTime != null) ? moment(scope.wainformation.FromTime).format('DD/MM/YYYY') : null,
                        appointmentTime: (scope.wainformation.FromTime != null) ? moment(scope.wainformation.FromTime).format('HH:mm') : null,
                        MedicareExpiryDate: (scope.wainformation.TelehealthAppointment.PatientAppointment && scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate != null) ? moment(scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate).format('DD/MM/YYYY') : null,
                        listDoctorTreatingPractitioner: null,
                        selectRadioGender: function() {
                            scope.wainformation.TelehealthAppointment.PatientAppointment.Gender = "";
                        }
                    }
                } else {
                    scope.info = {
                        apptStatus: WAConstant.apptStatus,
                        listDoctorTreatingPractitioner: null,
                        appointmentDate: (scope.wainformation.FromTime != null) ? moment(scope.wainformation.FromTime).format('DD/MM/YYYY') : null,
                        appointmentTime: (scope.wainformation.FromTime != null) ? moment(scope.wainformation.FromTime).format('HH:mm') : null,
                        listDoctorTreatingPractitioner: null,
                    }
                };

                scope.loadAllDoctor = function() {
                    WAAppointmentService.ListDoctor().then(function(data) {
                        scope.info.listDoctorTreatingPractitioner = data;
                    });
                }

                scope.loadAllDoctor();

                scope.selectTreatingPractitioner = function(data) {
                    WAAppointmentService.getDoctorById({
                        UID: data
                    }).then(function(data) {
                        scope.wainformation.Doctors[0] = data[0];
                        toastr.success("Select doctor successfully", "Success");
                    })
                }
                scope.ClinicalDetails = function() {
                    for (var key in scope.wainformation.TelehealthAppointment.ClinicalDetails) {
                        var newkey = key.split("__").join(" ");
                        var res = newkey.split(".");
                        var keyOtherRequest = res[2] + res[3];
                        keyOtherRequest = keyOtherRequest.split(" ").join("");
                        if (scope[keyOtherRequest] != undefined) {
                            if (scope[keyOtherRequest] == 'Yes') {
                                var object = {
                                    Section: res[0],
                                    Category: res[1],
                                    Type: res[2],
                                    Name: res[3],
                                    Value: scope.wainformation.TelehealthAppointment.ClinicalDetails[key].Value,
                                    FileUploads: scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads
                                }
                            }
                        } else {
                            var object = {
                                Section: res[0],
                                Category: res[1],
                                Type: res[2],
                                Name: res[3],
                                Value: scope.wainformation.TelehealthAppointment.ClinicalDetails[key].Value,
                                FileUploads: scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads
                            }
                        }
                        var isExist = false;

                        ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
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
                            ClinicalDetailsTemp.push(object);
                        };
                    };
                    var countCliniDetail = 0;
                    ClinicalDetailsTemp.forEach(function(value, key) {
                        if (value !== undefined) {
                            if (value.Value != 'N' && value.Value != null) {
                                countCliniDetail++;
                            };
                        };
                    })
                    if (countCliniDetail == 0) {
                        ClinicalDetailsTemp = [];
                    }
                    scope.wainformation.TelehealthAppointment.ClinicalDetails = ClinicalDetailsTemp;
                }
                scope.saveWaAppointment = function() {
                    scope.ValidateData();
                    scope.ClinicalDetails();
                    console.log(scope.wainformation)
                    WAAppointmentService.updateWaAppointment(scope.wainformation).then(function(data) {
                        console.log('saveWaAppointment', data);
                        toastr.success("Update appointment successfully !");
                        swal.close();
                        $state.go("authentication.WAAppointment.detail", {}, {
                            reload: true
                        });
                    }, function(err) {
                        if (err.status == 401) {
                            swal.close();
                        } else {
                            swal.close();
                            toastr.error('Update Appointment Failed');
                            $state.go("authentication.WAAppointment.detail", {}, {
                                reload: true
                            });
                        }
                    });
                }
                scope.ValidateData = function() {
                    if (!scope.wainformation.TelehealthAppointment && !scope.wainformation.TelehealthAppointment.PatientAppointment && !scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible) {
                        if (scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible == 'N') {
                            scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareNumber = null;
                            scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareReferenceNumber = null;
                            scope.info.MedicareExpiryDate = null;
                            scope.wainformation.TelehealthAppointment.PatientAppointment.DVANumber = null;
                        };
                    };
                    if (scope.wainformation.TelehealthAppointment.WAAppointment !== null && !scope.wainformation.TelehealthAppointment) {
                        if (!scope.wainformation.TelehealthAppointment.WAAppointment.IsUsualGP) {
                            if (scope.wainformation.TelehealthAppointment.WAAppointment.IsUsualGP == 'Y') {
                                scope.wainformation.TelehealthAppointment.WAAppointment.UsualGPName = null;
                                scope.wainformation.TelehealthAppointment.WAAppointment.UsualGPContactNumber = null;
                                scope.wainformation.TelehealthAppointment.WAAppointment.UsualGPFaxNumber = null;
                            };
                        };
                    };
                    if (scope.info.appointmentDate != null && scope.info.appointmentDate != '') {
                        var Time = moment(scope.info.appointmentTime, ["HH:mm:ss A"]).format("HH:mm:ss");
                        var appointmentDateTime = scope.info.appointmentDate + ' ' + Time + ' Z';
                        scope.wainformation.FromTime = moment(appointmentDateTime, "DD/MM/YYYY HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss Z');
                    } else {
                        scope.wainformation.FromTime = null;
                    };
                    console.log(scope.wainformation.TelehealthAppointment.PatientAppointment)
                    if (scope.info.MedicareExpiryDate != null && scope.info.MedicareExpiryDate != '') {
                        scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate = moment(scope.info.MedicareExpiryDate, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss Z');
                    } else {
                        if (scope.wainformation.TelehealthAppointment.PatientAppointment == null) {
                            scope.wainformation.TelehealthAppointment.PatientAppointment = {}
                        };
                        scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate = null
                    };
                    if (scope.wainformation.TelehealthAppointment.PatientAppointment.InterpreterRequired == 'N') {
                        scope.wainformation.TelehealthAppointment.PatientAppointment.InterpreterLanguage = null;
                    };
                }
                scope.CheckValidation = function() {
                    var stringAlert = null
                    if (scope.info.appointmentDate !== null) {
                        if (scope.info.appointmentTime !== null) {
                            if (scope.wainformation.Patients.length > 0) {
                                if (scope.wainformation.Doctors.length > 0) {
                                    stringAlert = null;
                                } else {
                                    stringAlert = "Please Choose Treating Practitioner";
                                };
                            } else {
                                stringAlert = "Please Link Patients";
                            };
                        } else {
                            stringAlert = "Please Choose Appointment Time";
                        };
                    } else {
                        stringAlert = "Please Choose Appointment Date";
                    };
                    return stringAlert
                }
                scope.close = function() {
                    $modalInstance.close();
                };
                scope.showImage = function(UID) {
                    var LinkUID = UID;
                    var modalInstance = $modal.open({
                        templateUrl: 'showImageTemplate',
                        controller: 'showImageController',
                        windowClass: 'app-modal-window-full',
                        resolve: {
                            LinkUID: function() {
                                return LinkUID;
                            }
                        }
                    });
                    modalInstance.result.then(function(data) {
                        $modalInstance.close('err');
                    });
                };

                scope.selectPatient = function() {
                    var PatientAppointment = angular.copy(scope.wainformation.TelehealthAppointment.PatientAppointment)
                    var postData = {
                        "data": {
                            "Title": PatientAppointment.Title,
                            "FirstName": PatientAppointment.FirstName,
                            "MiddleName": PatientAppointment.MiddleName,
                            "LastName": PatientAppointment.LastName,
                            "DOB": PatientAppointment.DOB,
                            "Gender": PatientAppointment.Gender,
                            "Address1": PatientAppointment.Address1,
                            "HomePhoneNumber": PatientAppointment.HomePhoneNumber,
                            "PhoneNumber": PatientAppointment.PhoneNumber,
                            "WorkPhoneNumber": PatientAppointment.WorkPhoneNumber,
                            "Suburb": PatientAppointment.Suburb,
                            "Postcode": PatientAppointment.Postcode,
                            "State": PatientAppointment.State,
                            "Email1": PatientAppointment.Email1,
                            "Email2": PatientAppointment.Email2,
                            "Address2": PatientAppointment.Address2,
                            "FaxNumber": PatientAppointment.FaxNumber,
                            "Indigenous": PatientAppointment.Indigenous,
                            "InterpreterLanguage": PatientAppointment.InterpreterLanguage,
                            "InterpreterRequired": PatientAppointment.InterpreterRequired,
                            "MaritalStatus": PatientAppointment.MaritalStatus,
                            "OtherSpecialNeed": PatientAppointment.OtherSpecialNeed,
                            "PreferredName": PatientAppointment.PreferredName,
                            "PreviousName": PatientAppointment.PreviousName,
                            "CountryID2": PatientAppointment.CountryOfBirth
                        },
                        "otherData": {
                            "PatientKin": {
                                "FirstName": PatientAppointment.FirstName,
                                "LastName": PatientAppointment.LastName,
                                "Relationship": PatientAppointment.PatientKinRelationship
                            },
                            "PatientMedicare": {
                                "MedicareEligible": PatientAppointment.MedicareEligible,
                                "MedicareNumber": PatientAppointment.MedicareNumber,
                                "MedicareReferenceNumber": PatientAppointment.MedicareReferenceNumber,
                                "MedicareExpiryDate": PatientAppointment.MedicareExpiryDate
                            },
                            "PatientDVA": {
                                "DVANumber": PatientAppointment.DVANumber
                            }
                        }
                    }
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: '../modules/appointment/views/appointmentSelectPatientModal.html',
                        controller: function($scope, $modalInstance) {
                            $scope.patient = {
                                runIfSuccess: function(data) {
                                    $modalInstance.close({
                                        status: 'success',
                                        data: data
                                    });
                                },
                                runIfClose: function() {
                                    $modalInstance.close();
                                }
                            };
                        },
                        windowClass: 'app-modal-window',
                        resolve: {
                            patientInfo: function() {
                                PatientService.postDatatoDirective(postData);
                            }
                        }
                    });
                    modalInstance.result.then(function(data) {
                        if (data && data.status == 'success') {
                            scope.info.isLinkPatient = true;
                            var patientUid = data.data.UID;
                            WAAppointmentService.GetDetailPatientByUid({
                                UID: patientUid
                            }).then(function(data) {
                                if (data.message == 'success') {
                                    console.log('patientInfomation', data.data[0]);
                                    console.log('scope.wainformation.Patients', scope.wainformation.Patients);
                                    scope.ShowData.isLinkPatient = true;
                                    scope.ShowData.patient = data.data[0];
                                    scope.ShowData.patient.PhoneNumber = data.data[0].UserAccount.PhoneNumber;
                                    scope.wainformation.Patients = [];
                                    scope.wainformation.Patients.push({
                                        UID: patientUid
                                    });
                                    toastr.success("Select patient successfully!", "success");
                                };
                            })
                        };
                    });
                };
                scope.submitUpdate = function() {
                    scope.submited = true
                    if (scope.userForm.$valid) {
                        var stringAlert = null;
                        if (scope.wainformation.Status == 'Approved' || scope.wainformation.Status == 'Attended' || scope.wainformation.Status == 'Waitlist' || scope.wainformation.Status == 'Finished') {
                            stringAlert = scope.CheckValidation();
                        };
                        if (scope.info.appointmentDate != null && scope.info.appointmentDate != '' || scope.info.appointmentTime != null && scope.info.appointmentTime != '') {
                            stringAlert = scope.CheckValidation();
                        };
                        if (stringAlert == null) {
                            swal({
                                    title: "Are you sure ?",
                                    text: "Update Appointment",
                                    type: "info",
                                    showCancelButton: true,
                                    closeOnConfirm: false,
                                    showLoaderOnConfirm: true,
                                },
                                function() {
                                    scope.saveWaAppointment();
                                });
                        } else {
                            toastr.error(stringAlert);
                        };
                    } else {
                        console.log(scope.userForm.$error);
                        toastr.error("Please check input data");
                    }
                };
            }
		},
	};
});