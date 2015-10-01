var app = angular.module("app", [
    "ui.router",
    "ui.bootstrap", 
    // "oc.lazyLoad",  
    // "ngSanitize",
    "app.security",
    "app.loggedIn",
    "angularFileUpload"
]);


app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('');
    $stateProvider
        .state('init', {
            url: '',
            resolve: {
                initHome: function($state, $timeout){
                    $timeout(function(){
                        $state.go('security.login');
                    },100);
                    
                }
            }
            
        })
        .state('lockscreen', {
            url: '/lockscreen',
            views: {
                'root': {
                    templateUrl:'common/views/lockscreen.html'
                }
            }
        });
});