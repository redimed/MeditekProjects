var app = angular.module("app.authentication.consultation.detail1.controller", [
]);
app.controller('consultationDetail1Ctrl', function($timeout, $scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams, AdmissionService, $q, toastr, EFormService) {
	// $state.go("authentication.consultation.detail1.workCover");
	$scope.toggle = true;
	$scope.ischooseAdmission = false;
	$scope.zoomLabel = 'Show Profile';
	$("#col2").hide();
	$scope.zoom = function(){
		$scope.toggle = !$scope.toggle;
		if($scope.toggle == true) {
			$scope.zoomLabel = 'Show Profile';
			$("#col1").removeClass("col-lg-9 col-md-8 col-sm-8 col-xs-8");
			$("#col1").addClass("col-xs-12");
			$("#col2").hide();
		} else {
			$scope.zoomLabel = 'Hide Profile';
			$("#col1").removeClass("col-xs-12");
			$("#col1").addClass("col-lg-9 col-md-8 col-sm-8 col-xs-8");
			$("#col2").show();
		}
	};

	//xu ly chon tab de view thong tin
    // $scope.showEForm = [];
	$scope.type;
	$scope.typeAppt;

    $scope.eFormTemplate = function(eformTemplate) {
        $state.go("authentication.consultation.detail.eForm.LoadForm", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient, UIDFormTemplate: eformTemplate.UID });
    };

	$scope.init = function(url) {
		console.log("state ",$state.current)
		$scope.type = '';
		$scope.typeAppt = '';
		if($state.current.name.indexOf('admission') != -1 && url != 'admission') {
			$state.go('authentication.consultation.detail1');
		}
		switch(url) {
			case 'referral':
                o.loadingPage(true);
				$scope.type = 'referral';
                getReferralForm()
                .then(function(Eform) {
                    $timeout(function() {
                        console.log("referral ",Eform);
                        $scope.showEForm = Eform;
                        o.loadingPage(false);
                    },0);
                }, function(err) {
                    o.loadingPage(false);
                    console.log("err ",err);
                })
			break;

			case 'workcover':
                o.loadingPage(true);
                $scope.showEForm = [];
				$scope.type = 'workcover';
                getWorkCoverForm()
                .then(function(Eform) {
                    $timeout(function() {
                        console.log("workcover ",Eform);
                        $scope.showEForm = Eform;
                        o.loadingPage(false);
                    },0);
                }, function(err) {
                    o.loadingPage(false);
                    console.log("er ",err);
                })
			break;

			case 'internal':
                o.loadingPage(true);
				$scope.type = 'internal';
                getInternalForm()
                .then(function(Eform) {
                    $timeout(function() {
                        console.log("internal ",Eform);
                        $scope.showEForm = Eform;
                        o.loadingPage(false);
                    },0);
                }, function(err) {
                    o.loadingPage(false);
                    console.log("err ",err);
                })
			break;

			case 'clinic':
				$scope.type = 'clinic';
			break;

			case 'drawing':
				$scope.type = 'drawing';
			break;

			case 'prescription':
				$scope.type = 'prescription';
			break;

			case 'dictation':
				$scope.type = 'dictation';
			break;

			case 'image':
				$scope.type = 'image';
			break;

			case 'consent':
                o.loadingPage(true);
                $scope.type = 'consent';
                getConsentForm()
                .then(function(Eform) {
                    $timeout(function() {
                        console.log("consent ",Eform);
                        $scope.showEForm = Eform;
                        o.loadingPage(false);
                    },0);
                }, function(err) {
                    o.loadingPage(false);
                    console.log("err ",err);
                })
			break;

			case 'admission':
				$scope.type = 'admission';
			break;

			case 'billing':
				$scope.type = 'billing';
			break;

			case 'appointment':
				$scope.type = 'appointment';
				$scope.typeAppt = $scope.wainformation.Type;
			break;

			default:
				$scope.type = '';
			break;

		}
	}
	//end

	//khai bao du lieu truyen len server
	//de lay list eform
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
    //end

    //lay thong tin appointment ve va hien thi len cac thanh menu
    $scope.dataDirective = {};
    $scope.eformTemplates = [];

    function getWorkCoverForm() {
        var p = new Promise(function(a, b) {
            var arr_workcover = [];
            var arr_name = ['WorkCover WA - FIRST',
                            'Workcover WA - Progress',
                            'Workcover WA - Final',
                            'Redimed Public Form',
                            'Redimed Private Form',
                            'WorkCover NSW',
                            'NT Final',
                            'NT First',
                            'NT Progress',
                            'Queensland',
                            'Tasmania Final/Progres',
                            'South Australia',
                            'Tasmania First',
                            'Victoria',
                            'Functional Assessment',
                            'Cat 1 Rail Medical Form V2.00',
                            'Rail Category 2 medical',
                            'Booklet to print (contains all 3 documents)',
                            'Cat 3 Rail Medical Form V2 00']
            for(var i = 0; i < $scope.eformTemplates.length; i++) {
                var temp = $scope.eformTemplates[i];
                if(arr_name.indexOf(temp.Name) !== -1) {
                    arr_workcover.push(temp);
                }
            }
            a(arr_workcover);
        });
        return p;
    }

    function getReferralForm() {
        var p = new Promise(function(a, b) {
            var arr_name = ['Redisite General Illness',
                                'Redisite Injury'];
            var arr_referral = []
            for(var i = 0; i < $scope.eformTemplates.length; i++) {
                var temp = $scope.eformTemplates[i];
                if(arr_name.indexOf(temp.Name) !== -1) {
                    arr_referral.push(temp);
                }
            }
            a(arr_referral);
        });
        return p;
    }

    function getConsentForm() {
        var p = new Promise(function(a, b) {
            var arr_name = ['Consent Form'];
            var arr_consent = []
            for(var i = 0; i < $scope.eformTemplates.length; i++) {
                var temp = $scope.eformTemplates[i];
                if(arr_name.indexOf(temp.Name) !== -1) {
                    arr_consent.push(temp);
                }
            }
            a(arr_consent);
        });
        return p;
    }

    function getInternalForm() {
        var p = new Promise(function(a, b) {
            var arr_name = ['Medical Assessment',
                                'Medical History',
                                'Medical Summary',
                                'Unmasked Air Conduction Audiometry Test Results',
                                'Hepatitis A & B Vaccine Consent Form'];
            var arr_internal = []
            for(var i = 0; i < $scope.eformTemplates.length; i++) {
                var temp = $scope.eformTemplates[i];
                if(arr_name.indexOf(temp.Name) !== -1) {
                    arr_internal.push(temp);
                }
            }
            a(arr_internal);
        });
        return p;
    }

    function getRole() {
        var arr_role = $cookies.getObject('userInfo').roles;
        if(arr_role.length > 0) {
            if(arr_role.length == 1) {
                return arr_role;
            }
            else {
                for(var i = 0; i < arr_role.length; i++) {
                    if(arr_role[i].RoleCode === 'ADMIN') {
                        return arr_role[i];
                    }
                    else if(arr_role[i].RoleCode === 'ASSISTANT') {
                        return arr_role[i];
                    }
                    else if(arr_role[i].RoleCode === 'INTERNAL_PRACTITIONER') {
                        return arr_role[i];
                    }
                    else if(arr_role[i].RoleCode === 'EXTERTAL_PRACTITIONER') {
                        return arr_role[i];
                    }
                    else if(arr_role[i].RoleCode === 'ORGANIZATION') {
                        return arr_role[i];
                    }
                    else {
                        return arr_role[i];
                    }
                }
            }
        }
    }

    function getEForm(postData) {
        var p = new Promise(function(a, b) {
            var arr_EForm = [];
            EFormService.PostListEFormTemplate(postData)
            .then(function(response) {
                var checkedUser = false;
                var eformTemplates = response.data.rows;
                var role = getRole();
                for (var j = 0; j < eformTemplates.length; j++) {
                    var template = eformTemplates[j];
                    for (var k = 0; k < template.Roles.length; k++) {
                        var RelEFormTemplateRole = template.Roles[k].RelEFormTemplateRole;
                        if (RelEFormTemplateRole.RoleID === role.ID && RelEFormTemplateRole.View === 'Y') {
                            checkedUser = true;
                            arr_EForm.push(template);
                            break;
                        }
                    }
                }
                a(arr_EForm);
            }, function(err) {
                b(err);
            })

        });
        return p;
    }

    $scope.styleFunction = function(EForms) {
        var check = false;
        for (var i = 0; i < EForms.length; i++) {
            var EForm = EForms[i];
            var Appointments = EForm.Appointments;
            for (var j = 0; j < Appointments.length; j++) {
                var Appointment = Appointments[j];
                if (Appointment.UID === $stateParams.UID && EForm.Status ==o.const.eformStatus.saved) {
                    check = 1;
                    break;
                }
                if (Appointment.UID === $stateParams.UID && EForm.Status ==o.const.eformStatus.finalized) {
                    check = 2;
                    break;
                }
            }
        }
        switch(check) {
            case 1: 
                return 'label-green';
                break;
            case 2:
                return 'label-warning';
                break;
            default:
                return 'label-info';
                break;
        }
        // return (check) ? 'label-green' : 'label-info';
    }

    $scope.getTelehealthDetail = function(UID) {
        o.loadingPage(true);
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            $scope.wainformation = data.data;
            $scope.dataDirective.setDataPatientDetail($scope.wainformation);
            $scope.dataDirective.setDataMedicare($scope.wainformation);
            $scope.dataDirective.setDataApptDetail($scope.wainformation);
            getEForm(postData)
            .then(function(res) {
                console.log("response ",res);
                $scope.eformTemplates = res;
            }, function(err) {
                console.log("err ",err);
            })
            o.loadingPage(false);
        }, function(err) {
            console.log("err ",err);
        });
    };

    $scope.Params = $stateParams;
    $scope.getTelehealthDetail($scope.Params.UID);
    //end

    //kiem tra role cua user truy cap
    $scope.HasRoleAdminOrPractitioner = false;
    var userInfo = JSON.parse($cookies.get('userInfo'));

    for (var i = 0; i < userInfo.roles.length; i++) {
        var role = userInfo.roles[i];
        if (role.RoleCode === 'INTERNAL_PRACTITIONER' || role.RoleCode === 'ADMIN') {
            $scope.HasRoleAdminOrPractitioner = true;
        }
    }
    //end

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
        var p = new Promise(function(a, b) {
	        AdmissionService.GetListAdmission(data).then(function(response) {
	            a(response);
	        }, function(err) {
	            b(err);
	        });
        });
        return p;
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
    apptAdmission
	.then(function(data) {
        if (data.count > 0) {
            $scope.admissionUID = data.rows[0].UID;
            setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
            return "AdmissionAppointmentExists";
        };
        return "AdmissionAppointmentNotExists";
    })
    .then(function(data) {
        if (data == 'AdmissionAppointmentNotExists') {
            promiseGetListAdmission($scope.admissionInfo.patientAdmission).then(function(data) {
                if (data.count > 0) {
                    setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                    return { message: "AdmissionPatientExists", data: data.rows[0] };
                };
                return { message: "AdmissionPatientNotExists" };
            }).then(function(data) {
                var info = {
                    UID: $stateParams.UID,
                    Admissions: [{
                        AdmissionData: ((data.message === "AdmissionPatientExists") ? data.data.AdmissionData : [])
                    }]
                };
                AdmissionService.CreateAdmission(info).then(function(data) {
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

    $scope.admission = function() {
    	$scope.ischooseAdmission = true;
        $state.go("authentication.consultation.detail1.admission.detail");
    };

    $scope.runWhenFinish = {
        success:function () {
        	console.log("?????????? caasdasdasdiuasdhausidhadasduadiuahsiudhasiudhuai")
            $state.go("authentication.consultation.detail1", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient }, { reload: true });
        }
    };
    $scope.uid = {
        show: function(uid) {
            $scope.consultationuid = uid;
        }
    }

});
  