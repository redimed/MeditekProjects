var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
    'app.authentication.consultation.directives.consultNoteDirectives'
]);
app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams, AdmissionService, $q, toastr, EFormService) {
    /* EFORM */
    var postData = {
        Filter: [{
            EFormTemplate: {
                Enable: 'Y'
            }
        }, {
            Appointment: {
                UID: $stateParams.UID
            }
        }]
    };

    $scope.dataDirective = {};

    $scope.getTelehealthDetail = function(UID) {
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            $scope.wainformation = data.data;
            $scope.dataDirective.setDataPatientDetail($scope.wainformation);
            $scope.dataDirective.setDataMedicare($scope.wainformation);
            $scope.dataDirective.setDataApptDetail($scope.wainformation);
            console.log(" o day wainformation ", $scope.wainformation);
        }, function(error) {});
    };

    $scope.Params = $stateParams;
    console.log("$scope.Params", $scope.Params.UID);
    $scope.getTelehealthDetail($scope.Params.UID);

    $scope.HasRoleAdminOrPractitioner = false;

    EFormService.PostListEFormTemplate(postData)
        .then(function(response) {
            var checkedUser = false;
            var eformTemplates = response.data.rows;
            $scope.eformTemplates = [];
            for (var i = 0; i < $cookies.getObject('userInfo').roles.length; i++) {
                var role = $cookies.getObject('userInfo').roles[i];
                for (var j = 0; j < eformTemplates.length; j++) {
                    var template = eformTemplates[j];
                    for (var k = 0; k < template.Roles.length; k++) {
                        var RelEFormTemplateRole = template.Roles[k].RelEFormTemplateRole;
                        if (RelEFormTemplateRole.RoleID === role.ID && RelEFormTemplateRole.View === 'Y') {
                            checkedUser = true;
                            $scope.eformTemplates.push(template);
                            break;
                        }
                    }
                }
            }

        }, function(error) {

        })

    $scope.eFormTemplate = function(eformTemplate) {
        $state.go("authentication.consultation.detail.eForm.LoadForm", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient, UIDFormTemplate: eformTemplate.UID });
    };

    var userInfo = JSON.parse($cookies.get('userInfo'));

    for (var i = 0; i < userInfo.roles.length; i++) {
        var role = userInfo.roles[i];
        if (role.RoleCode === 'INTERNAL_PRACTITIONER' || role.RoleCode === 'ADMIN') {
            $scope.HasRoleAdminOrPractitioner = true;
        }
    }

    $scope.styleFunction = function(EForms) {
            var check = false;
            for (var i = 0; i < EForms.length; i++) {
                var EForm = EForms[i];
                var Appointments = EForm.Appointments;
                for (var j = 0; j < Appointments.length; j++) {
                    var Appointment = Appointments[j];
                    if (Appointment.UID === $stateParams.UID && EForm.Status ==o.const.eformStatus.saved) {
                        check = true;
                        break;
                    }
                }
            }
            return (check) ? 'green-jungle' : 'blue-steel';
        }
        /* END EFORM */
        //
    $scope.checkRoleUpdate = true;

    for (var i = 0; i < $cookies.getObject('userInfo').roles.length; i++) {
        if ($cookies.getObject('userInfo').roles[i].RoleCode == 'INTERNAL_PRACTITIONER' || $cookies.getObject('userInfo').roles[i].RoleCode == 'ADMIN') {
            $scope.checkRoleUpdate = false;
        };
    }
    //





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
                console.log('updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', data);
                console.log('updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', $scope.admissionDetail);
                return "AdmissionAppointmentExists";
            };
            return "AdmissionAppointmentNotExists";
        })
        .then(function(data) {
            console.log(data)
            if (data == 'AdmissionAppointmentNotExists') {
                promiseGetListAdmission($scope.admissionInfo.patientAdmission).then(function(data) {
                    console.log("1111", data);
                    if (data.count > 0) {
                        setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                        return { message: "AdmissionPatientExists", data: data.rows[0] };
                    };
                    console.log("createeeeeeeeeeeeeeeeeeeeeeeeee");
                    return { message: "AdmissionPatientNotExists" };
                }).then(function(data) {
                    console.log("message", data.message === "AdmissionPatientExists") && false;
                    console.log("AdmissionData", data);
                    var info = {
                        UID: $stateParams.UID,
                        Admissions: [{
                            AdmissionData: ((data.message === "AdmissionPatientExists") ? data.data.AdmissionData : [])
                        }]
                    };
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", info);
                    AdmissionService.CreateAdmission(info).then(function(data) {
                        console.log("create admission", data.admissionResponse);
                        console.log("create admissionResponse", data.admissionResponse[0].UID);
                        $scope.admissionUID = data.admissionResponse[0].UID;
                        return "success"
                    }, function(error) {
                        return "error"
                    }).then(function(data) {
                        if (data == "success") {

                        };
                    });
                });
            };
        })
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
        if ($scope.wainformation.Type == 'Onsite') {
            $state.go("authentication.consultation.detail.Onsite", { UID: $scope.wainformation.UID })
        } else {
            //$state.go("authentication.consultation.detail.telehealth", { UID: $scope.wainformation.UID });
            $state.go("authentication.WAAppointment.detail", { UID: $scope.wainformation.UID });
        }
    };

    var col9 = "ol-lg-9 col-md-8 col-xs-6";
    var col3 = "col-lg-3 col-md-4 col-xs-6";
    $scope.iconCol = "Hide Detail"
    $scope.fullScreen = function() {
        col9 = col9 === "ol-lg-9 col-md-8 col-xs-6" ? "col-md-12 col-sm-12" : "ol-lg-9 col-md-8 col-xs-6";
        col3 = col3 === "col-lg-3 col-md-4 col-xs-6" ? "hide" : "col-lg-3 col-md-4 col-xs-6";
        $scope.iconCol = $scope.iconCol === "Hide Detail" ? "Show Detail" : "Hide Detail";
        angular.element("#col9").attr("class", col9);
        angular.element("#col3").attr("class", col3);
    };

    $scope.getEFormByPatient = function() {
        if (!_.isEmpty($scope.wainformation)) {
            if ($scope.wainformation.Patients && $scope.wainformation.Patients.length > 0) {
                var patientUID = $scope.wainformation.Patients[0].UID;
                var userUID = $scope.wainformation.Patients[0].UserAccount.UID;
                var UID = $stateParams.UID;
                $state.go("authentication.consultation.eformbypatient", { UID: UID, patientUID: patientUID, userUID: userUID });
            } else {
                toastr.error("Patient not found.");
            }
        } else {
            toastr.error("Patient not found.");
        }

    }
});
