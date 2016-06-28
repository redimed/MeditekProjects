var app = angular.module("app.authentication.consultation.controller",[
	'app.authentication.consultation.list.controller',
	'app.authentication.consultation.detail.controller',
	'app.authentication.consultation.drawing.controller',
	'app.authentication.consultation.directives.listAppoint',
	'app.authentication.consultation.directives.listAppConsultation',
	'app.authentication.consultation.directives.listPatientConsultation',
	'app.authentication.consultation.detail.telehealth.controller',
	'app.authentication.consultation.listPatient.controller',
	'app.authentication.consultation.patient.controller',
]);

app.controller('consultationCtrl', function($rootScope, $scope){
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = true;
    });
});
