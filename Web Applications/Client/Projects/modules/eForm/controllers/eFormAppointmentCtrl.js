var app = angular.module('app.authentication.eForm.appointment.controller',[
]);

app.controller('eFormAppointmentCtrl', function($scope, $stateParams){
	var AppointmentUID = $stateParams.UID;
            var PatientUID = $stateParams.UIDPatient;
            $scope.eFormBaseUrl = o.const.eFormBaseUrl;
            var contentHeight = $('.page-content').height()-80;
            $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eform?appoinmentUID='+AppointmentUID+'&patientUID='+PatientUID);
            $('#eformDev').attr('height', contentHeight);
});