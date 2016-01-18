var app = angular.module('app.authentication.admission.detail.controller', []);
app.controller('admissionDetailCtrl', function($scope, $timeout, $uibModal, AdmissionService, $stateParams) {
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
    }
});
