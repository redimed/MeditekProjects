var app = angular.module('app', [
    "ui.router",
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "app.unAuthentication",
    "app.authentication"
    // "app.loggedIn",
    // "angularFileUpload"
]);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('');
	$stateProvider
		.state('sys', {
			url:'',
			controller: function($scope,$rootScope){
				
			},
			resolve: {
				initHome: function($state, $timeout){
					$timeout(function(){
                        $state.go('unAuthentication.login');
                    },100);
				}
			}
		});
})

.run(function($rootScope){
// 	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
// 		Metronic.init();
// 	})
	$rootScope.$on('$viewContentLoaded', function() {
		// alert("OK");
        Metronic.initAjax();
    });
})