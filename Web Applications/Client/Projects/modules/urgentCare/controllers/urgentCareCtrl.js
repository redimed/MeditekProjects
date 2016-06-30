var app = angular.module('app.authentication.urgentCare.controller', [
	"app.authentication.urgentCare.list.controller",
]);

app.controller('urgentCareCtrl', function($rootScope, $scope){
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
});