var app = angular.module('app.authentication.WAAppointment.directives.detailWAAppoint', []);
app.directive('detailWaappoint', function(AppointmentService, toastr) {
    return {
        scope: {
            wainformation: '='
        },
        restrict: 'E',
        templateUrl: "modules/WAAppointment/directives/templates/WAAppointmentDetail.html",
        controller: function($scope) {
            console.log('wainformation', $scope.wainformation);
            $scope.info = {
                apptStatus: WAConstant.apptStatus,
                requestDate: moment($scope.wainformation.CreatedDate).format('DD/MM/YYYY'),
                listDoctorTreatingPractitioner:null,
                patientInfomation:($scope.wainformation.Patients.length != 0)?$scope.wainformation.Patients:$scope.wainformation.TelehealthAppointment.PatientAppointment,
                appointmentDate:($scope.wainformation.FromTime != null)?moment($scope.wainformation.FromTime).utc().format('DD/MM/YYYY'):null,
                appointmentTime:($scope.wainformation.FromTime != null)?moment($scope.wainformation.FromTime).utc().format('h:mm A'):null,
                listDoctorTreatingPractitioner:null,
            }

            $scope.loadAllDoctor = function() {
                AppointmentService.ListDoctor().then(function(data) {
                    $scope.info.listDoctorTreatingPractitioner = data;
                    console.log('$scope.info.listDoctorTreatingPractitioner',$scope.info.listDoctorTreatingPractitioner)
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
        }
    };
})
