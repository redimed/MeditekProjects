var app = angular.module('app.authentication.eForm.appointment.controller',[
]);

app.controller('eFormAppointmentCtrl', function($scope, $stateParams, $cookies){
            var UserUID = $cookies.getObject('userInfo').UID;
	var AppointmentUID = $stateParams.UID;
            var PatientUID = $stateParams.UIDPatient;
            $scope.eFormBaseUrl = o.const.eFormBaseUrl;
            var contentHeight = $('.page-content').height()-80;
            $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eform?appoinmentUID='+AppointmentUID+'&patientUID='+PatientUID+'&userUID='+UserUID);
            //$('#eformDev').attr('height', contentHeight);
});