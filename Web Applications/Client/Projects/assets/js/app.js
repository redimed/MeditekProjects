var app = angular.module("app", [
    "ui.router",
    "ui.bootstrap", 
    "restangular", // RESTANGULAR
    // "oc.lazyLoad",  
    // "ngSanitize",
    "app.security",
    "app.loggedIn",
    "angularFileUpload"
]);


app.config(function($stateProvider, $urlRouterProvider, RestangularProvider){
    // RESTANGULAR DEFAULT
    RestangularProvider.setBaseUrl("http://localhost:1337");
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