var app = angular.module('app', [
	"ngCookies",
    "ngAnimate",
    "ui.router",
    "ui.bootstrap", 
    "ngSanitize",
    "restangular",
    "toastr",
    "ladda",
    "app.unAuthentication",
    "app.authentication"
]);

app
	.config(function($httpProvider,$stateProvider, $urlRouterProvider, RestangularProvider, toastrConfig){
        // TOASTR CONFIG
        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 5,    
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: true,
            target: 'body',
            tapToDismiss: true
        });
        //END TOASTR CONFIG

		// JWT SIGN
        $httpProvider.interceptors.push(function($q, $location, $cookies) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    if ($cookies.get('token')) {
                        config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                    }
                    return config;
                },
                'responseError': function(response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });
        // END JWT SIGN

        // CORS PROXY
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // END CORS PROXY

        //RESTANGULAR DEFAULT
        RestangularProvider.setBaseUrl("http://testapp.redimed.com.au:3005");

		$urlRouterProvider.otherwise('');
		$stateProvider
			.state('sys', {
				url:'',
				resolve: {
					initHome: function($state, $timeout,$cookies){
	                    if (!$cookies.get("userInfo")) {
	                        $timeout(function() {
	                            $state.go("unAuthentication.login");
	                        }, 100);
	                    } else {
	                        $timeout(function() {
	                            $state.go("authentication.home.list");
	                        }, 100);
	                    }
					}
				}
			});
	})

	.run(function($rootScope,$cookies,$window,$state){
		$rootScope.$on('$stateChangeSuccess',function(e, toState, toParams, fromState, fromParams){
			if (!$cookies.get("userInfo")) {
                if (toState.name !== "unAuthentication.login" && toState.name !== "unAuthentication.register") {
                    e.preventDefault();
                    $state.go("unAuthentication.login", null, {
                        location: "replace",
                        reload: true
                    });
                }
	        } else {
	        	if (toState.name == "unAuthentication.login" || toState.name == "unAuthentication.register") {
                    e.preventDefault();
                    $state.go("authentication.home.list", null, {
                        location: "replace",
                        reload: true
                    });
                }
	        }
		})

		$rootScope.$on('$viewContentLoaded', function() {
	        Metronic.initAjax();
	    });
	})