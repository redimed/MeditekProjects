var app = angular.module('app.authentication.admission.detail.controller', []);
app.controller('admissionDetailCtrl', function($scope, $cookies, $timeout, $uibModal, AdmissionService, $stateParams, consultationServices, PatientService) {
    /* THAO */
    $scope.admissionDetail.cardiovascular_triglycerides= 'N';
    $scope.admissionDetail.cardiovascular_hypertension= 'N';
    $scope.admissionDetail.cardiovascular_angina= 'N';
    $scope.admissionDetail.cardiovascular_fibrillation= 'N';
    $scope.admissionDetail.cardiovascular_condition= 'N';
    $scope.admissionDetail.cardiovascular_disease= 'N';
    $scope.admissionDetail.cardiovascular_cardiac_disease= 'N';
    $scope.admissionDetail.endocrinology_diabetes= 'N';
    $scope.admissionDetail.endocrinology_blood_glucose= 'N';
    $scope.admissionDetail.endocrinology_goitre= 'N';
    $scope.admissionDetail.gastrointestinal_reflux= 'N';
    $scope.admissionDetail.gastrointestinal_jaundice= 'N';
    $scope.admissionDetail.gastrointestinal_ibs= 'N';
    $scope.admissionDetail.bleeding_disorders_lungs= 'N';
    $scope.admissionDetail.bleeding_disorders_anaemia= 'N';
    $scope.admissionDetail.bleeding_disorders_problems= 'N';
    $scope.admissionDetail.musculoskeletal_osteoarthritis= 'N';
    $scope.admissionDetail.musculoskeletal_problems= 'N';
    $scope.admissionDetail.neurology_dystrophies= 'N';
    $scope.admissionDetail.neurology_tia= 'N';
    $scope.admissionDetail.neurology_weakness= 'N';
    $scope.admissionDetail.neurology_turns= 'N';
    $scope.admissionDetail.respiratory_emphysema= 'N';
    $scope.admissionDetail.respiratory_inclines= 'N';
    $scope.admissionDetail.anti_inflammatory= 'N';
    $scope.admissionDetail.herbal_supplements= 'N';
    $scope.admissionDetail.lifestyle_alcohol= 'N';
    $scope.admissionDetail.lifestyle_drugs= 'N';
    $scope.admissionDetail.allergies_alerts_hyperthermia= 'N';
    $scope.admissionDetail.anti_coagulant= 'N';
    $scope.admissionDetail.lifestyle_smoked= 'N';

    $scope.ChangeRadio = function(testname) {
        for (var i = 0; i < testname.length; i++) {
            $("input[name=" + testname[i] + "]").val(null);
        }

    };

    $scope.getDate = new Date();

    $scope.doctorUseOnly = function() {
        var userprofile = $cookies.getObject("userprofile");
        if (userprofile.doctor != null) {
            return false;
        } else
            return true;
    };

    /* END THAO */
    $timeout(function() {
        $scope.admissionDetail.DoctorDateChoose = moment().format('DD/MM/YYYY');
        if ($scope.wainformation) {
             $scope.admissionDetail.MedicareEligible = $scope.admissionDetail.MedicareEligible ? $scope.admissionDetail.MedicareEligible : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible : '';
            $scope.admissionDetail.MedicareReferenceNumber = $scope.admissionDetail.MedicareReferenceNumber ? $scope.admissionDetail.MedicareReferenceNumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareReferenceNumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareReferenceNumber : '';
            $scope.admissionDetail.MedicareNumber = $scope.admissionDetail.MedicareNumber ? $scope.admissionDetail.MedicareNumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareNumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareNumber : '';
            $scope.admissionDetail.ExpiryDate = $scope.admissionDetail.ExpiryDate ? $scope.admissionDetail.ExpiryDate : $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate ? $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate : '';
            $scope.admissionDetail.DVANumber = $scope.admissionDetail.DVANumber ? $scope.admissionDetail.DVANumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.DVANumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.DVANumber : '';
            $scope.admissionDetail.KinFirstName = $scope.admissionDetail.KinFirstName ? $scope.admissionDetail.KinFirstName : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinFirstName ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinFirstName : '';
            $scope.admissionDetail.KinLastName = $scope.admissionDetail.KinLastName ? $scope.admissionDetail.KinLastName : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinLastName ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinLastName : '';
            $scope.admissionDetail.Relationship = $scope.admissionDetail.Relationship ? $scope.admissionDetail.Relationship : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinRelationship ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinRelationship : '';
            $scope.admissionDetail.MobilePhoneNumber = $scope.admissionDetail.MobilePhoneNumber ? $scope.admissionDetail.MobilePhoneNumber : $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinMobilePhoneNumber ? $scope.wainformation.TelehealthAppointment.PatientAppointment.PatientKinMobilePhoneNumber : '';
            if ($scope.wainformation.Doctors.length > 0) {
                if ($scope.wainformation.Doctors[0].FirstName || $scope.wainformation.Doctors[0].LastName) {
                    $scope.admissionDetail.DoctorFullName = $scope.admissionDetail.DoctorFullName ? $scope.admissionDetail.DoctorFullName : $scope.wainformation.Doctors[0].FirstName + ' ' + $scope.wainformation.Doctors[0].LastName;
                }

                if ($scope.wainformation.Doctors[0].FileUpload != null && $scope.wainformation.Doctors[0].FileUpload != '') {
                    $scope.admissionDetail.DoctorSignature = $scope.wainformation.Doctors[0].FileUpload.UID;
                }
            }
            if ($scope.wainformation.Patients.length > 0) {
                $scope.admissionDetail.FirstName = $scope.wainformation.Patients[0].FirstName ? $scope.wainformation.Patients[0].FirstName : '';
                $scope.admissionDetail.LastName = $scope.wainformation.Patients[0].LastName ? $scope.wainformation.Patients[0].LastName : '';
                $scope.admissionDetail.DOB = $scope.wainformation.Patients[0].DOB ? $scope.wainformation.Patients[0].DOB : '';
                $scope.admissionDetail.Gender = $scope.wainformation.Patients[0].Gender ? $scope.wainformation.Patients[0].Gender : '';
                PatientService.detailChildPatient({ UID: $scope.wainformation.Patients[0].UID, model: ['PatientMedicare', 'PatientDVA', 'PatientKin'] })
                .then(function(response) {
                    console.log("detail Patient child ", response);
                    if (response.data) {
                        if (response.data.PatientMedicare.length > 0) {
                            $scope.admissionDetail.MedicareEligible = $scope.admissionDetail.MedicareEligible ? $scope.admissionDetail.MedicareEligible : response.data.PatientMedicare[0].MedicareEligible ? response.data.PatientMedicare[0].MedicareEligible : '';
                            $scope.admissionDetail.MedicareReferenceNumber = $scope.admissionDetail.MedicareReferenceNumber ? $scope.admissionDetail.MedicareReferenceNumber : response.data.PatientMedicare[0].MedicareReferenceNumber ? response.data.PatientMedicare[0].MedicareReferenceNumber : '';
                            $scope.admissionDetail.MedicareNumber = $scope.admissionDetail.MedicareNumber ? $scope.admissionDetail.MedicareNumber : response.data.PatientMedicare[0].MedicareNumber ? response.data.PatientMedicare[0].MedicareNumber : '';
                            $scope.admissionDetail.ExpiryDate = $scope.admissionDetail.ExpiryDate ? $scope.admissionDetail.ExpiryDate : response.data.PatientMedicare[0].ExpiryDate ? moment(response.data.PatientMedicare[0].ExpiryDate, 'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY') : '';
                        }
                        if (response.data.PatientDVA.length > 0) {
                            $scope.admissionDetail.DVANumber = $scope.admissionDetail.DVANumber ? $scope.admissionDetail.DVANumber : response.data.PatientDVA[0].DVANumber ? response.data.PatientDVA[0].DVANumber : '';
                        }
                        if (response.data.PatientKin.length > 0) {
                            $scope.admissionDetail.KinFirstName = $scope.admissionDetail.KinFirstName ? $scope.admissionDetail.KinFirstName : response.data.PatientKin[0].FirstName ? response.data.PatientKin[0].FirstName : '';
                            $scope.admissionDetail.KinLastName = $scope.admissionDetail.KinLastName ? $scope.admissionDetail.KinLastName : response.data.PatientKin[0].LastName ? response.data.PatientKin[0].LastName : '';
                            $scope.admissionDetail.Relationship = $scope.admissionDetail.Relationship ? $scope.admissionDetail.Relationship : response.data.PatientKin[0].Relationship ? response.data.PatientKin[0].Relationship : '';
                            $scope.admissionDetail.MobilePhoneNumber = $scope.admissionDetail.MobilePhoneNumber ? $scope.admissionDetail.MobilePhoneNumber : response.data.PatientKin[0].MobilePhoneNumber ? response.data.PatientKin[0].MobilePhoneNumber : '';
                        }
                    }
                }, function(err) {
                    console.log(err);
                })
            }
        }
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
    console.log('wainformation ', $scope.wainformation);

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
        if (table_name == 'PREVIOUS_SURGERY_PROCEDURES') {
            col = 4;
            array_attributes = ['operation', 'appros_year', 'surgeon', 'notes'];
        } else if (table_name == 'MEDICATIONS') {
            col = 6;
            array_attributes = ['medication', 'frequency', 'daily_dose', 'cessation_intruction', 'date_ceased', 'nursing_notes'];
        } else {
            console.log("table_name.Error");
        }
        for (var key in obj) {
            for (var i = 0; i < array_attributes.length; i++) {
                if (key === array_attributes[i]) {
                    array_data.push({
                        ref: table_name + '_table',
                        refChild: 'field_' + rows + '_' + i,
                        name: key,
                        value: obj[key]
                    });
                }
            }
        }
        return col;
    }

    $scope.click = function() {
        console.log($scope.wainformation);
        var postdata = {
            printMethod: 'jasper',
            templateUID: 'patient_admission',
            data: []
        };
        // var data = [];
        // console.log($scope.admissionDetail);

        for (var key in $scope.admissionDetail) {
            if (typeof $scope.admissionDetail[key] == 'string') {
                postdata.data.push({ name: key, value: $scope.admissionDetail[key] });
            } else if (Array.isArray($scope.admissionDetail[key]) == true) {
                var i = 0;
                var col = 0;
                for (var j = 0; j < $scope.admissionDetail[key].length; j++) {
                    col = $scope.parse($scope.admissionDetail[key][j], postdata.data, i, key, col);
                    i++;

                }

                postdata.data.push({ ref: key + '_table', name: key, rows: i, columns: col, type: 'table' });
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
    };

    // $scope.Disabled = function() {
    //   expect(element(by.css('text')).getAttribute('disabled')).toBeFalsy();
    //   element(by.model('radio')).click();
    //   expect(element(by.css('text')).getAttribute('disabled')).toBeTruthy();
    // };
});
