var app = angular.module('app.authentication.WAAppointment.list.detail.controller', []);

app.controller('WAAppointmentListDetailCtrl', function($scope, $modalInstance, data, WAAppointmentService, toastr, $modal, PatientService) {
    $modalInstance.rendered.then(function() {
        App.initComponents(); // init core components
        App.initAjax();
        ComponentsDateTimePickers.init(); // init todo page
        ComponentsSelect2.init(); // init todo page
        ComponentsBootstrapSelect.init(); // init todo page
        Portfolio.init();
        //ComponentsDropdowns.init(); // init todo page
    });
    $scope.wainformation = data;
    $scope.Temp = angular.copy(data)
    $scope.loadFuntion = function(){
         $scope.wainformation.TelehealthAppointment.ClinicalDetails = {}
            $scope.Temp.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes, indexRes) {
                if (valueRes != null && valueRes != undefined) {
                    var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name
                    keyClinicalDetail = keyClinicalDetail.split(" ").join("__")
                    $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail] = {}
                    $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].Value = valueRes.Value
                    $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].FileUploads = valueRes.FileUploads
                    $scope[valueRes.Name] = 'Yes'
                }
            })
    }
    $scope.loadFuntion()
    console.log( $scope.wainformation.TelehealthAppointment.ClinicalDetails )
    console.log('$scope.wainformation',$scope.wainformation);
    $scope.info = {
        apptStatus: WAConstant.apptStatus,
        listDoctorTreatingPractitioner: null,
        patientInfomation: ($scope.wainformation.Patients.length != 0) ? $scope.wainformation.Patients : $scope.wainformation.TelehealthAppointment.PatientAppointment,
        appointmentDate: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).utc().format('DD/MM/YYYY') : null,
        appointmentTime: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).utc().format('h:mm A') : null,
        listDoctorTreatingPractitioner: null
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
            $scope.wainformation.FromTime = null
        };
        console.log('nênnenenenenenene',$scope.wainformation);
        WAAppointmentService.updateWaAppointment($scope.wainformation).then(function(data) {
            console.log('saveWaAppointment', data);
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
                    runIfClose: function(){
                        $modalInstance.close();
                    }
                };
            },
            windowClass: 'app-modal-window',
            resolve: {
                patientInfo: function() {
                    PatientService.postDatatoDirective($scope.info.patientInfomation);
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
                        console.log('patientInfomation',data.data[0]);
                        $scope.wainformation.Patients.push({
                            UID: patientUid
                        });
                        toastr.success("Select patient successfully!", "success");
                    };
                })
            };
        });
    };
});
