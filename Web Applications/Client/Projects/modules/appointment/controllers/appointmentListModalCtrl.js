var app = angular.module('app.authentication.appointment.list.modal.controller', []);
app.controller('showImageController', function($scope, $modalInstance,toastr,LinkUID){
      $scope.LinkUID = LinkUID
      $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
      }

      $scope.Vieww = function(LinkUID){
            var newWindow = window.open("");
            newWindow.document.write("<img class='img-responsive' src='"+LinkUID+"'>");
      }
})
app.controller('appointmentListModalCtrl', function($scope, $modal, $modalInstance, getid, AppointmentService, CommonService, $cookies, toastr) {

    $modalInstance.rendered.then(function() {
        //App.initComponents(); // init core components
        ComponentsDateTimePickers.init(); // init todo page
        ComponentsSelect2.init(); // init todo page
        ComponentsBootstrapSelect.init(); // init todo page
        Portfolio.init();
        //ComponentsDropdowns.init(); // init todo page
    });
     $scope.ViewDoc = function(Url,UID){
            var LinkUID = Url + UID
            window.open(LinkUID);
      }
    $scope.modal_close = function() {
        $modalInstance.close();
    };
    $scope.close = function() {
        $modalInstance.close();
    };

    // console.log("=======",FormWizard.init());
    //createNewPatient : open popup create patient
    $scope.selectPatient = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../modules/appointment/views/appointmentSelectPatientModal.html',
            controller: function($scope,$modalInstance) {
                $scope.patient = {
                    runIfSuccess : function (data) {
                        $modalInstance.close({status:'success',data:data});
                    }
                };
            },
            windowClass: 'app-modal-window'

        });
        modalInstance.result.then(function (data) {
            if (data.status == 'success') {
                $scope.appointment.Patient=[];
                $scope.appointment.Patient.push({UID:data.data.data.UID});
                toastr.success("Select patient successfully!","success");
                console.log('$scope.appointment.Patient',$scope.appointment.Patient);
            };
        });
    };

    $scope.loadAllDoctor = function () {
        AppointmentService.ListDoctor().then(function (data) {
            $scope.listDoctor = data;
            //console.log('$scope.listDoctor',$scope.listDoctor);
        });
    }

    $scope.loadAllDoctor();

    $scope.selectTreatingPractitioner = function  (data) {
        AppointmentService.getDoctorById({UID: data}).then(function (data) {
            $scope.appointment.Doctors[0] = data[0];
        })
    }

    $scope.Url = AppointmentService.getImage()
    $scope.checkRoleUpdate = true
    $scope.tab_body_part = 'all';
    if($cookies.getObject('userInfo').roles[0].RoleCode == 'ADMIN' 
      || $cookies.getObject('userInfo').roles[0].RoleCode == 'ASSISTANT' 
      || $cookies.getObject('userInfo').roles[0].RoleCode == 'INTERNAL_PRACTITIONER'){
      $scope.checkRoleUpdate = false
    }
    
    $scope.ShowData = {
        DateTimeAppointmentDate: null,
        PatientsFullName: null,
        isLinkPatient: false,
        PreferredPractitionersTemp:[]
    }
    $scope.appointment = null
    $scope.Other = {
        LacerationsOther: 'N',
        SkincancerOther: 'N',
        PNSOther: 'N'
    }

    var ClinicalDetails = CommonService.GetClinicalDetails();
    var listDoctor = CommonService.GetNamDoctor()
    var load = function() {
        AppointmentService.getDetailApppointment(getid).then(function(response) {
            $scope.Temp = angular.copy(response.data)
            $scope.appointment = angular.copy(response.data);
            
            if ($scope.appointment.Patients.length != 0) {
                $scope.ShowData.isLinkPatient = true
                $scope.appointment.TelehealthAppointment.PatientAppointment = angular.copy($scope.appointment.Patients[0])
            }
            $scope.appointment.TelehealthAppointment.ClinicalDetails = {}
            $scope.Temp.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes, indexRes) {
                if (valueRes != null && valueRes != undefined) {
                    var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name
                    keyClinicalDetail = keyClinicalDetail.split(" ").join("__")
                    $scope.appointment.TelehealthAppointment.ClinicalDetails[keyClinicalDetail] = {}
                    $scope.appointment.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].Value = valueRes.Value
                    $scope.appointment.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].ClinicalNote = valueRes.ClinicalNote
                }
            })
            if (checkDateUndefined($scope.appointment.TelehealthAppointment.PatientAppointment.DOB)) {
                $scope.patientDOBTemp = formatDate($scope.appointment.TelehealthAppointment.PatientAppointment.DOB);
            };
            $scope.referringPractitionerDateTemp = formatDate($scope.appointment.Doctors.RefDate);

            if ($scope.appointment.RequestDate) {
                $scope.appointment.RequestDate = formatDate($scope.appointment.RequestDate)
            }
            if (response.data.FromTime) {
                var DateTime = angular.copy(response.data.FromTime);
                $scope.ShowData.DateTimeAppointmentDate = moment(DateTime, "YYYY-MM-DD HH:mm:ss Z").utc().format("DD/MM/YYYY");
                $scope.ShowData.DateTimeAppointmentDateTime = moment(DateTime).utc().format('H:mm A');
            }

            if (checkDateUndefined($scope.appointment.TelehealthAppointment.PatientAppointment.FirstName)) {
                $scope.ShowData.PatientsFullName = $scope.appointment.TelehealthAppointment.PatientAppointment.FirstName + ' ' + $scope.appointment.TelehealthAppointment.PatientAppointment.LastName
            }
            listDoctor.forEach(function(valueInit, indexInit) {
                $scope.appointment.TelehealthAppointment.PreferredPractitioners.forEach(function(valueRes, indexRes) {
                    if (valueInit.Name == valueRes.Name) {
                        valueInit.Value = 'Y'
                    }
                })
            })
             $scope.ShowData.PreferredPractitionersTemp= angular.copy(listDoctor);
            checkOtherInput()
        });
    }
    var checkDateUndefined = function(data) {
        if (data == ' ' || data == '' || data == undefined) {
            return false
        }
        return true
    }
    var checkOtherInput = function() {
        if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Lacerations.Others']) && $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Lacerations.Others'].Value) {
            $scope.Other.LacerationsOther = 'Y'
        };
        if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Skin__cancer.Other']) && $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.Skin__cancer.Other'].Value) {
            $scope.Other.SkincancerOther = 'Y'
        };
        if (checkDateUndefined($scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.PNS.Other']) &&
            $scope.appointment.TelehealthAppointment.ClinicalDetails['Clinical__Details.Telehealth__Appointment.PNS.Other'].Value) {
            $scope.Other.PNSOther = 'Y'
        };
    }
    var formatDate = function(data) {
        var date = moment(data, "YYYY-MM-DD HH:mm:ss Z").format("DD/MM/YYYY");
        return date
    }
    var formatDateServer = function(data) {
        moment(data, "MM/DD/YYYY HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss Z')
    }
    $scope.appointmentload = {
        load: function() {
            load();
        }
    }
    $scope.appointmentload.load();
    $scope.showImage = function(Link,UID){
      var LinkUID = Link+UID
      $modal.open({
            templateUrl: 'showImageTemplate',
            controller: 'showImageController',
            windowClass: 'app-modal-window-full',
            resolve: {
                  LinkUID: function(){
                        return LinkUID;
                  }
            }
      })
      }
    $scope.updateAppointment = function() {

        $scope.ShowData.DateTimeAppointmentDateTime = moment($scope.ShowData.DateTimeAppointmentDateTime, ["h:mm A"]).format("HH:mm:ss");
        var StringAppointmentDateTime = $scope.ShowData.DateTimeAppointmentDate + ' ' + $scope.ShowData.DateTimeAppointmentDateTime + ' Z'
        $scope.appointment.FromTime = moment(StringAppointmentDateTime, "MM/DD/YYYY HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss Z')

        if ($scope.appointment.Status == "Approved") {
            $scope.appointment.ApprovalDate = moment().format('YYYY-MM-DD HH:mm:ss Z')
        } else {
            $scope.appointment.ApprovalDate = null
        }

        $scope.appointment.UserInfo = {
            UID: $cookies.getObject("userInfo").UID
        }

        var PreferredPractitioners = []

        $scope.ShowData.PreferredPractitionersTemp.forEach(function(valueRes, indexRes) {
            if (valueRes.Value == "Y") {
                PreferredPractitioners.push(valueRes)
            }
        })
        //console.log(PreferredPractitioners)
        $scope.appointment.TelehealthAppointment.PreferredPractitioners = angular.copy(PreferredPractitioners)

        var ClinicalDetailsTemp = []
        for (var key in $scope.appointment.TelehealthAppointment.ClinicalDetails) {
            var newkey = key.split("__").join(" ")
            var res = newkey.split(".");
            var object = {
                Section: res[0],
                Category: res[1],
                Type: res[2],
                Name: res[3],
                Value: $scope.appointment.TelehealthAppointment.ClinicalDetails[key].Value
            }
            var isExist = false
            ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
                if (valueTemp.Section == object.Section &&
                    valueTemp.Category == object.Category &&
                    valueTemp.Type == object.Type &&
                    valueTemp.Name == object.Name) {
                    isExist = true
                }
            })
            if (!isExist) {
                ClinicalDetailsTemp.push(object)
            };

        };
        if ($scope.ShowData.isLinkPatient) {
            $scope.appointment.TelehealthAppointment.PatientAppointment = []
        };
        $scope.appointment.RequestDate = moment($scope.appointment.RequestDate, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss Z')
        $scope.appointment.TelehealthAppointment.ClinicalDetails = angular.copy(ClinicalDetailsTemp)
        var postData = {
            data: $scope.appointment
        }
        AppointmentService.upDateApppointment(postData).then(function(response) {
            if (response == 'success') {
                $modalInstance.close('success');
                toastr.success('UpDate Apppointment success')
            };

        })
    }
});
