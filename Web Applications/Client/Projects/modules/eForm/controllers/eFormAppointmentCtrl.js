var app = angular.module('app.authentication.eForm.appointment.controller',[
]);

app.controller('eFormAppointmentCtrl', function($scope, $stateParams){
	var AppointmentUID = $stateParams.UID;
            var PatientUID = $stateParams.UIDPatient;
            $scope.eFormBaseUrl = o.const.eFormBaseUrl;
            $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eform?appoinmentUID='+AppointmentUID+'&patientUID='+PatientUID);
});