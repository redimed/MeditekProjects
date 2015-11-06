var app = angular.module('app.authentication.WAAppointment.list.detail.controller', []);

app.controller('WAAppointmentListDetailCtrl', function($scope, $modalInstance, data, AppointmentService, toastr) {
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
    console.log('$scope.wainformation',$scope.wainformation);
    $scope.info = {
        apptStatus: WAConstant.apptStatus,
        requestDate: moment($scope.wainformation.CreatedDate).format('DD/MM/YYYY'),
        listDoctorTreatingPractitioner: null,
        patientInfomation: ($scope.wainformation.Patients.length != 0) ? $scope.wainformation.Patients : $scope.wainformation.TelehealthAppointment.PatientAppointment,
        appointmentDate: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).utc().format('DD/MM/YYYY') : null,
        appointmentTime: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).utc().format('h:mm A') : null,
        listDoctorTreatingPractitioner: null,
        radioTest: 'Y'
    }

    $scope.loadAllDoctor = function() {
        AppointmentService.ListDoctor().then(function(data) {
            $scope.info.listDoctorTreatingPractitioner = data;
        });
    }

    $scope.loadAllDoctor();

    $scope.selectTreatingPractitioner = function(data) {
        AppointmentService.getDoctorById({
            UID: data
        }).then(function(data) {
            $scope.wainformation.Doctors[0] = data[0];
            toastr.success("Select doctor successfully", "Success");
        })
    }

    $scope.close = function() {
        $modalInstance.close();
    };
});
