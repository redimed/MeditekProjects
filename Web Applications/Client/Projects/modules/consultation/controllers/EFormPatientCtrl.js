var app = angular.module("app.authentication.consultation.patient.controller",[
]);

app.controller('EFormPatientCtrl', function($scope, $state, $timeout){
	console.log($state.params);
	$scope.isIframe = false;
    $scope.patientUID =  $state.params.patientUID;
    $scope.userUID = $state.params.userUID;
    $scope.getEForm = function() {
        $scope.isIframe = true;
        var userUID = $state.params.userUID;
		var eFormBaseUrl = o.const.eFormBaseUrl;
		var patientUID = $state.params.patientUID;
		var contentHeight = $('.page-content').height()-80;
		$('#EForm').attr('src', eFormBaseUrl+'/#/eform/patient?patientUID='+patientUID+'&userUID='+userUID);
    };

    $timeout(function() {
    	//mac dinh phai goi truoc khi render ra template
    	$scope.getEForm();
    },0);
});