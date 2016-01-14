var app = angular.module('app.authentication.admission.request.step3.controller', []);

app.controller('admissionRequestStep3Ctrl', function($scope, $timeout, AdmissionService, $stateParams) {
    console.log("$stateParams", $stateParams.data.UID);
    $timeout(function() {
        App.initAjax();
    }, 0);
    angular.element(".progress-bar").attr("style", "width:100%");
    $scope.admission = {
        UID: $stateParams.data.UID,
        Admissions: [{
            AdmissionData: []
        }]
    }
    $scope.submit = function() {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196F3",
                confirmButtonText: "OK",
                closeOnConfirm: false
            }, function() {
                console.log("admissionRequest", $scope.admissionRequest);
                _.forEach($scope.admissionRequest, function(value, name) {
                    if (value.length > 0) {
                        console.log(name, value);
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
                        $scope.admission.Admissions[0].AdmissionData.push(data);
                    }
                });

                console.log("$scope.admission", $scope.admission);
                AdmissionService.CreateAdmission($scope.admission).then(function(data) {
                    swal("Update success!", "", "success");
                }, function(error) {
                    swal("Update error!", "", "error");
                });
            });
        }
    };
});
