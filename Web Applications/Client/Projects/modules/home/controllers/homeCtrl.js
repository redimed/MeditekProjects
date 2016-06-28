var app = angular.module('app.authentication.home.controller',[
	'app.authentication.home.list.controller',
	'app.authentication.home.detail.controller',
]);

app.controller('homeCtrl', function($scope, $rootScope){
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
});