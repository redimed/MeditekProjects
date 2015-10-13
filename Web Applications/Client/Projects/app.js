var app = angular.module('app', [
    "ngCookies",
    "ngAnimate",
    "ui.router",
    "ui.bootstrap", 
    "app.lockScreen",
    "ngSanitize",
    "restangular",
    "toastr",
    "ladda",
    "app.unAuthentication",
    "app.authentication"
]);

app
    .config(function($httpProvider, $stateProvider, $urlRouterProvider, RestangularProvider, toastrConfig) {
        // TOASTR CONFIG
<<<<<<< d37fc4a4b6e98fa50f512f45aa3a44aa5f5f6a5e
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
=======
        // angular.extend(toastrConfig, {
        //     autoDismiss: false,
        //     containerId: 'toast-container',
        //     maxOpened: 5,    
        //     newestOnTop: true,
        //     positionClass: 'toast-top-right',
        //     preventDuplicates: false,
        //     preventOpenDuplicates: true,
        //     target: 'body',
        //     tapToDismiss: true
        // });
>>>>>>> update GUI register, doctor, patient
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
<<<<<<< d37fc4a4b6e98fa50f512f45aa3a44aa5f5f6a5e
        RestangularProvider.setBaseUrl("http://192.168.1.2:3005");
        $urlRouterProvider.otherwise('');
        $stateProvider.state('sys', {
            url: '',
            resolve: {
                initHome: function($state, $timeout, $cookies) {
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
    .run(function($rootScope, $cookies, $window, $state, Restangular, toastr) {
=======
        // RestangularProvider.setBaseUrl("http://testapp.redimed.com.au:3005");
        RestangularProvider.setBaseUrl("http://192.168.1.2:3005");

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
			})
			.state('lockScreen', {
    			url:'/lockScreen',
    			views: {
    				'root':{
    					templateUrl: 'common/views/lockScreen.html',
    					controller: 'lockScreenCtrl'
    				}
    			}
		    });
			
	})

	.run(function($rootScope,$cookies,$window,$state,Restangular,toastr){
>>>>>>> update GUI register, doctor, patient
        // RESTANGULAR ERROR HANDLING
        // Restangular.setErrorInterceptor(function (response) {
        //     if (response.status == 401) {
        //         toastr.error('Oops, looks like something went wrong here.<br>Please try your request again later.<br><br>Error Code: ' + response.status,'ERROR!!', {
        //             allowHtml: true,
        //             progressBar: true,
        //             closeButton: true
        //         });
        //     } else if (response.status == 400) {
        //         toastr.error('Oops, looks like something went wrong here.<br>Please try your request again later.<br><br>Error Code: ' + response.status,'ERROR!!', {
        //             allowHtml: true,
        //             progressBar: true,
        //             closeButton: true
        //         });
        //     } else {
        //         toastr.error("Response received with HTTP error code: " + response.status,'ERROR!!', {
        //             allowHtml: true,
        //             progressBar: true,
        //             closeButton: true
        //         });
        //     }
        //     return false;
        // });
        // END RESTANGULAR ERROR HANDLING
        $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
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
		      ComponentsDropdowns.init(); // init todo page
	    });
	})

