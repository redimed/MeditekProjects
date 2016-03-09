var app = angular.module('app.authentication.admission.detail.controller', []);
app.controller('admissionDetailCtrl', function($scope, $timeout, $uibModal, AdmissionService, $stateParams, consultationServices) {
    $timeout(function() {
        App.initAjax();
    }, 0);

    var PREVIOUS_SURGERY_PROCEDURES = ($scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES) ? $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES : $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES = [];
    var MEDICATIONS = ($scope.admissionDetail.MEDICATIONS) ? $scope.admissionDetail.MEDICATIONS : $scope.admissionDetail.MEDICATIONS = [];
    $scope.admission = {
        create: {
            UID: $stateParams.UID,
            Admissions: [{
                AdmissionData: []
            }]
        },
        update: {
            UID: $stateParams.UID,
            Admissions: [{
                AdmissionData: [],
                UID: $scope.admissionUID
            }]
        }
    };

    function saveAddmission(input) {
        swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2196F3",
            confirmButtonText: "OK",
            closeOnConfirm: false
        }, function() {
            _.forEach($scope.admissionDetail, function(value, name) {
                if (value.length > 0) {
                    // console.log(name, value);
                    var data = {
                        Section: "Admission Details",
                        Category: "Admission",
                        Type: "Admission",
                        Name: name,
                        Value: null
                    }
                    if (name == "PREVIOUS_SURGERY_PROCEDURES" || name == "MEDICATIONS") {
                        data.Value = JSON.stringify(value);
                    } else {
                        data.Value = value;
                    };
                    input.Admissions[0].AdmissionData.push(data);
                }
            });
            // console.log(input);
            if (input == $scope.admission.update) {
                // console.log('update');
                AdmissionService.UpdateAdmission(input).then(function(data) {
                    swal("Update success!", "", "success");
                }, function(error) {
                    swal("Update error!", "", "error");
                });
            } else {
                // console.log('create');
                AdmissionService.CreateAdmission($scope.admission.create).then(function(data) {
                    swal("Create success!", "", "success");
                }, function(error) {
                    swal("Create error!", "", "error");
                });
            };

        });
    };

    $scope.UpdateAdmission = function() {
        if ($scope.admissionUID) {
            saveAddmission($scope.admission.update);
        } else {
            saveAddmission($scope.admission.create);
        };
    };

    $scope.openModalAdd1 = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd1.html',
            controller: 'modalAdd1Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Add data';
                },
                PREVIOUS_SURGERY_PROCEDURES: function() {
                    return PREVIOUS_SURGERY_PROCEDURES;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                // 
            }, function(result) {
                // 
            });
    };
    $scope.openModaUpdate1 = function(index) {
        var data = $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES[index];
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd1.html',
            controller: 'modalUpdate1Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Update data';
                },
                dataModal: function() {
                    return data;
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES[result.index] = result.data;
            }, function(result) {
                // dismiss
            });
    };
    $scope.openModalDelete1 = function(index) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'sm',
            templateUrl: 'modules/admission/views/modalDelete1.html',
            controller: 'modalDelete1Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Delete data';
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.PREVIOUS_SURGERY_PROCEDURES.splice(result.index, 1);
            }, function(result) {
                // dismiss
            });
    };

    $scope.openModalAdd2 = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd2.html',
            controller: 'modalAdd2Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Add data';
                },
                MEDICATIONS: function() {
                    return MEDICATIONS;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                // 
            }, function(result) {
                // 
            });
    };
    $scope.openModaUpdate2 = function(index) {
        var data = $scope.admissionDetail.MEDICATIONS[index];
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd2.html',
            controller: 'modalUpdate2Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Update data';
                },
                dataModal: function() {
                    return data;
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.MEDICATIONS[result.index] = result.data;
            }, function(result) {
                // dismiss
            });
    };
    $scope.openModalDelete2 = function(index) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'sm',
            templateUrl: 'modules/admission/views/modalDelete2.html',
            controller: 'modalDelete2Ctrl',
            resolve: {
                titleModal: function() {
                    return 'Delete data';
                },
                index: function() {
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.MEDICATIONS.splice(result.index, 1);
            }, function(result) {
                // dismiss
            });
    };
    $scope.resertSubstancesData = function() {
        $scope.admissionDetail.allergies_alerts_substances_list = "";
    };

    $scope.parse = function(obj, array_data, rows, table_name) {
        var array_attributes = [];
        var col = 0;
        if(table_name == 'PREVIOUS_SURGERY_PROCEDURES') {
            col = 4;
            array_attributes = ['operation','appros_year','surgeon','notes'];
        }
        else if(table_name == 'MEDICATIONS') {
            col = 6;
            array_attributes = ['medication','frequency','daily_dose','cessation_intruction','date_ceased','nursing_notes'];
        }
        else {
            console.log("table_name.Error");
        }
        for(var key in obj) {
            for(var i = 0; i < array_attributes.length; i++) {
                if(key === array_attributes[i]) {
                    array_data.push({
                        ref:table_name+'_table',
                        refChild:'field_'+rows+'_'+i,
                        name:key,
                        value:obj[key]
                    });
                }
            }
        }
        return col;
    }

    $scope.click = function() {
        console.log($scope.wainformation);
        var postdata ={
            printMethod:'jasper',
            templateUID:'patient_admission',
            data: []
        };
        // var data = [];
        // console.log($scope.admissionDetail);
        if($scope.wainformation.Patients.length > 0) {
            postdata.data.push({
                name:'FirstName',
                value:$scope.wainformation.Patients[0].FirstName
            });
            postdata.data.push({
                name:'LastName',
                value:$scope.wainformation.Patients[0].LastName
            });
            postdata.data.push({
                name:'DOB',
                value:$scope.wainformation.Patients[0].DOB
            });
            postdata.data.push({
                name:'Gender',
                value:$scope.wainformation.Patients[0].Gender
            });
            if($scope.wainformation.Patients[0].PatientMedicares.length > 0) {
                postdata.data.push({
                    name:'MedicareEligible',
                    value:$scope.wainformation.Patients[0].PatientMedicares[$scope.wainformation.Patients[0].PatientMedicares.length-1].MedicareEligible
                });
                postdata.data.push({
                    name:'MedicareNumber',
                    value:$scope.wainformation.Patients[0].PatientMedicares[$scope.wainformation.Patients[0].PatientMedicares.length-1].MedicareNumber
                });
                postdata.data.push({
                    name:'MedicareReferenceNumber',
                    value:$scope.wainformation.Patients[0].PatientMedicares[$scope.wainformation.Patients[0].PatientMedicares.length-1].MedicareReferenceNumber
                });
                postdata.data.push({
                    name:'ExpiryDate',
                    value:$scope.wainformation.Patients[0].PatientMedicares[$scope.wainformation.Patients[0].PatientMedicares.length-1].ExpiryDate
                });
            }
            if($scope.wainformation.Patients[0].PatientKins.length > 0) {
                postdata.data.push({
                    name:'KinFirstName',
                    value:$scope.wainformation.Patients[0].PatientKins[$scope.wainformation.Patients[0].PatientKins.length-1].FirstName
                });
                postdata.data.push({
                    name:'KinLastName',
                    value:$scope.wainformation.Patients[0].PatientKins[$scope.wainformation.Patients[0].PatientKins.length-1].LastName
                });
                postdata.data.push({
                    name:'Relationship',
                    value:$scope.wainformation.Patients[0].PatientKins[$scope.wainformation.Patients[0].PatientKins.length-1].Relationship
                });
                postdata.data.push({
                    name:'MobilePhoneNumber',
                    value:$scope.wainformation.Patients[0].PatientKins[$scope.wainformation.Patients[0].PatientKins.length-1].MobilePhoneNumber
                });
            }
            if($scope.wainformation.Patients[0].PatientDVAs.length > 0) {
                postdata.data.push({
                    name:'DVANumber',
                    value:$scope.wainformation.Patients[0].PatientDVAs[$scope.wainformation.Patients[0].PatientDVAs.length-1].DVANumber
                });
            }
        }
        for(var key in $scope.admissionDetail){
            if(typeof $scope.admissionDetail[key] == 'string'){
                postdata.data.push({name:key,value:$scope.admissionDetail[key]});
            }
            else if(Array.isArray($scope.admissionDetail[key]) == true) {
                var i = 0;
                var col = 0;
                for(var j = 0; j < $scope.admissionDetail[key].length; j++) {
                    col = $scope.parse($scope.admissionDetail[key][j],postdata.data,i,key, col);
                    i++;
                    // for(var prop in $scope.admissionDetail[key][j]) {
                    //     if(prop != '$$hashKey'){
                    //         postdata.data.push({
                    //             ref:key+'_table',
                    //             refChild:'field_'+j+'_'+i,
                    //             name:prop,
                    //             value:$scope.admissionDetail[key][j][prop]
                    //         });
                    //         i++;
                    //     }
                    // }
                }
                console.log(col);
                postdata.data.push({ref:key+'_table',name:key,rows:i,columns:col,type:'table'});
            }
        }
        consultationServices.PrintPDF(postdata).then(function(responsePrintPDF) {
            console.log(responsePrintPDF)
            var blob = new Blob([responsePrintPDF.data], {
                type: 'application/pdf'
            });
            saveAs(blob, "PatientAdmission");
        }, function(err) {
            console.log(err);
        });
        console.log(postdata);
    }
});
