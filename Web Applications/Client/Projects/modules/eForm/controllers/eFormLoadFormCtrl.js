var app = angular.module('app.authentication.eForm.loadForm.controller',[
]);

app.controller('eFormLoadFormCtrl', function($scope, $stateParams, $cookies, $state){
    var UserUID = $cookies.getObject('userInfo').UID;
    var AppointmentUID = $stateParams.UID;
    var PatientUID = $stateParams.UIDPatient;
    var TemplateUID = $stateParams.UIDFormTemplate;
    $scope.eFormBaseUrl = o.const.eFormBaseUrl;
    var contentHeight = $('.page-content').height()-80;
    $('#eform').attr('src', $scope.eFormBaseUrl+'/#/eform/detail?appointmentUID='+AppointmentUID+'&patientUID='+PatientUID+'&templateUID='+TemplateUID+'&userUID='+UserUID);

    $scope.eforms = function() {
        $state.go("authentication.consultation.detail.eForm.appointment", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient });
    };
});