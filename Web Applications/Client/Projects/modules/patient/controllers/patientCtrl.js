var app = angular.module('app.authentication.patient.controller', [
	'app.authentication.patient.list.controller',
	'app.authentication.patient.create.controller'
]);

app.controller('patientCtrl', function($scope, $rootScope, $q){
	$scope.data = {};
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
});

			