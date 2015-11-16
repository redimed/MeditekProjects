var app = angular.module('app.authentication.WAAppointment.list.detail.controller', []);

app.controller('WAAppointmentListDetailCtrl', function($cookies,$scope, $modalInstance, data, WAAppointmentService, toastr, $modal, PatientService, CommonService) {
    $modalInstance.rendered.then(function() {
        App.initComponents(); // init core components
        App.initAjax();
        ComponentsDateTimePickers.init(); // init todo page
        ComponentsSelect2.init(); // init todo page
        ComponentsBootstrapSelect.init(); // init todo page
        Portfolio.init();
        //ComponentsDropdowns.init(); // init todo page
    });
    $scope.ViewDoc = function(Url, UID) {
        var LinkUID = Url + UID;
        CommonService.downloadFile(UID)
            .then(function(data) {
                console.log(data);
            }, function(er) {
                console.log(er);
            })
    }
    $scope.wainformation = data;
    $scope.tab_body_part = 'all';
    $scope.checkRoleUpdate = true;
    if ($cookies.getObject('userInfo').roles[0].RoleCode == 'ADMIN' || $cookies.getObject('userInfo').roles[0].RoleCode == 'ASSISTANT' || $cookies.getObject('userInfo').roles[0].RoleCode == 'INTERNAL_PRACTITIONER') {
        $scope.checkRoleUpdate = false;
    };
    console.log('$scope.wainformation', $scope.wainformation);
    $scope.Temp = angular.copy(data)
    var ClinicalDetailsTemp = [];
    $scope.loadFuntion = function() {
        if ($scope.wainformation.TelehealthAppointment != null || $scope.wainformation.TelehealthAppointment != undefined) {
            $scope.wainformation.TelehealthAppointment.ClinicalDetails = {}
            $scope.Temp.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes, indexRes) {
                if (valueRes != null && valueRes != undefined) {
                    var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name;
                    keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                    var keyOther = valueRes.Type + valueRes.Name;
                    console.log(keyOther)
                    if(keyOther!=0){
                        keyOther = keyOther.split(" ").join("");
                    }
                    
                    $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail] = {};
                    $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].Value = valueRes.Value;
                    $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                    $scope[valueRes.Name] = 'Yes';
                    if (valueRes.Name == 'OThers' || valueRes.Name == 'Other') {
                        $scope[keyOther] = 'Yes';
                    }
                }
            })
        };

    }
    $scope.loadFuntion();
    $scope.info = {
        apptStatus: WAConstant.apptStatus,
        listDoctorTreatingPractitioner: null,
        patientInfomation: ($scope.wainformation.Patients.length != 0) ? $scope.wainformation.Patients : $scope.wainformation.TelehealthAppointment.PatientAppointment,
        appointmentDate: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).utc().format('DD/MM/YYYY') : null,
        appointmentTime: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).utc().format('h:mm A') : null,
        ExpiryDate: ($scope.wainformation.TelehealthAppointment.PatientAppointment.ExpiryDate != null) ? moment($scope.wainformation.TelehealthAppointment.PatientAppointment.ExpiryDate).format('DD/MM/YYYY') : null,
        listDoctorTreatingPractitioner: null,
        selectRadioGender: function() {
            $scope.wainformation.TelehealthAppointment.PatientAppointment.Gender = "";
        }
    }

    $scope.loadAllDoctor = function() {
        WAAppointmentService.ListDoctor().then(function(data) {
            $scope.info.listDoctorTreatingPractitioner = data;
        });
    }

    $scope.loadAllDoctor();

    $scope.selectTreatingPractitioner = function(data) {
        WAAppointmentService.getDoctorById({
            UID: data
        }).then(function(data) {
            $scope.wainformation.Doctors[0] = data[0];
            toastr.success("Select doctor successfully", "Success");
        })
    }

    $scope.saveWaAppointment = function() {
        if ($scope.info.appointmentDate != null && $scope.info.appointmentDate != '') {
            var Time = moment($scope.info.appointmentTime, ["HH:mm:ss A"]).format("HH:mm:ss");
            var appointmentDateTime = $scope.info.appointmentDate + ' ' + Time + ' Z';
            $scope.wainformation.FromTime = moment(appointmentDateTime, "DD/MM/YYYY HH:mm:ss Z").utc().format('YYYY-MM-DD HH:mm:ss Z');
        } else {
            $scope.wainformation.FromTime = null;
        };
        if ($scope.info.ExpiryDate != null && $scope.info.ExpiryDate != '') {
            $scope.wainformation.TelehealthAppointment.PatientAppointment.ExpiryDate = moment($scope.info.ExpiryDate, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss Z');
        };
        for (var key in $scope.wainformation.TelehealthAppointment.ClinicalDetails) {
            var newkey = key.split("__").join(" ");
            var res = newkey.split(".");
            var keyOtherRequest = res[2] + res[3];
            keyOtherRequest = keyOtherRequest.split(" ").join("");
            if ($scope[keyOtherRequest] != undefined) {
                if ($scope[keyOtherRequest] == 'Yes') {
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].Value,
                        FileUploads: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads
                    }
                }
            } else {
                var object = {
                    Section: res[0],
                    Category: res[1],
                    Type: res[2],
                    Name: res[3],
                    Value: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].Value,
                    FileUploads: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads
                }
            }
            var isExist = false;

            ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
                if (valueTemp.Section == object.Section &&
                    valueTemp.Category == object.Category &&
                    valueTemp.Type == object.Type &&
                    valueTemp.Name == object.Name) {
                    isExist = true;
                }
            })
            if (!isExist) {
                ClinicalDetailsTemp.push(object);
            };
        };
        var countCliniDetail = 0;
        ClinicalDetailsTemp.forEach(function(value, key) {
            if (value.Value != 'N' && value.Value != null) {
                countCliniDetail++;
            };
        })
        if (countCliniDetail == 0) {
            ClinicalDetailsTemp = [];
        }
        $scope.wainformation.TelehealthAppointment.ClinicalDetails = ClinicalDetailsTemp;
        WAAppointmentService.updateWaAppointment($scope.wainformation).then(function(data) {
            console.log('saveWaAppointment', data);
            $modalInstance.close('success');
            swal("Success.");
        })
    }

    $scope.close = function() {
        $modalInstance.close();
    };

    $scope.selectPatient = function() {
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
                    PatientService.postDatatoDirective($scope.wainformation.TelehealthAppointment.PatientAppointment);
                }
            }

        });
        modalInstance.result.then(function(data) {
            if (data && data.status == 'success') {
                $scope.info.isLinkPatient = true;
                var patientUid = data.data.UID;
                WAAppointmentService.GetDetailPatientByUid({
                    UID: patientUid
                }).then(function(data) {
                    if (data.message == 'success') {
                        console.log('patientInfomation', data.data[0]);
                        $scope.wainformation.Patients.push({
                            UID: patientUid
                        });
                        toastr.success("Select patient successfully!", "success");
                    };
                })
            };
        });
    };

    $scope.submitUpdate = function() {
        swal({
                title: "Are you sure ?",
                text: "Update Appointment",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
            function() {
                $scope.saveWaAppointment();
            });
    };
});
