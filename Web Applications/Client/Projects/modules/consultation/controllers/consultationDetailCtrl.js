var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
    'app.authentication.consultation.directives.consultNoteDirectives'
]);
app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams, AdmissionService, $q, toastr, EFormService) {
    /* EFORM */
    var postData = {
            Filter: [
                    {
                        EFormTemplate: {
                            Enable: 'Y'
                        }
                    }
            ]
    }
    EFormService.PostListEFormTemplate(postData)
    .then(function(response){
            $scope.eformTemplates = response.data.rows;
    }, function(error){
            
    })

    $scope.eFormTemplate = function(eformTemplate) {
        $state.go("authentication.consultation.detail.eForm.LoadForm", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient,  UIDFormTemplate: eformTemplate.UID});
    };
    /* END EFORM */


    $scope.Params = $stateParams;
    console.log("$scope.Params", $scope.Params.UID);
    $scope.getTelehealthDetail = function(UID) {
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            $scope.wainformation = data.data;
            WAAppointmentService.GetDetailPatientByUid({
                UID: $scope.wainformation.Patients[0].UID
            }).then(function(data) {
                console.log("aaaaaaaaaaaaaaaaaaaa",data);
            })
        }, function(error) {

        });
    };

    $scope.getTelehealthDetail($scope.Params.UID);

    /*==addmission star==*/
    $scope.admissionDetail = {};
    $scope.admissionInfo = {
        appointmentAdmission: {
            Filter: [{
                Appointment: {
                    UID: $scope.Params.UID
                },
                Patient: {
                    UID: $scope.Params.UIDPatient
                }
            }],
            Order: [{
                Admission: {
                    ID: 'DESC'
                }
            }]
        },
        patientAdmission: {
            Filter: [{
                Patient: {
                    UID: $scope.Params.UIDPatient
                }
            }],
            Order: [{
                Admission: {
                    ID: 'DESC'
                }
            }]
        }
    }

    function promiseGetListAdmission(data) {
        var deferred = $q.defer();
        AdmissionService.GetListAdmission(data).then(function(data) {
            deferred.resolve(data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function setDetailAdmission(input, output) {
        _.forEach(input, function(value, name) {
            var itemData = null;
            if (value.Name == "PREVIOUS_SURGERY_PROCEDURES" || value.Name == "MEDICATIONS") {
                itemData = JSON.parse(value.Value);
            } else {
                itemData = value.Value;
            };
            output[value.Name] = itemData;
        });
    }

    var apptAdmission = promiseGetListAdmission($scope.admissionInfo.appointmentAdmission);
    apptAdmission.then(function(data) {
            if (data.count > 0) {
                $scope.admissionUID = data.rows[0].UID;
                setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                console.log('$scope.admissionApptDetail', $scope.admissionDetail);
                return "success";
            };
            return "error";
        }, function(error) {
            console.log(error);
        })
        .then(function(data) {
            console.log(data)
            if (data == 'error') {
                promiseGetListAdmission($scope.admissionInfo.patientAdmission).then(function(data) {
                    console.log("1111", data);
                    if (data.count > 0) {
                        setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                    };
                    console.log('$scope.admissionPatientDetail', $scope.admissionDetail);
                });
            };
        });
    /*==addmission end==*/
    $scope.eForms = function() {
        $state.go("authentication.consultation.detail.eForm.appointment", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient });
    };
    $scope.admission = function() {
        $state.go("authentication.consultation.detail.admission.detail");
    };
    $scope.consultNote = function() {
        $state.go("authentication.consultation.detail.consultNote");
    };
    $scope.telehealthDetail = function() {
        if($scope.wainformation.Type == 'Onsite'){
             $state.go("authentication.onsite.appointment", { UID: $scope.wainformation.UID })
        }else{
            $state.go("authentication.consultation.detail.telehealth",{ UID: $scope.wainformation.UID });
        }
    };
});
