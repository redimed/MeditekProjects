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
    "app.common.ngEnter",
    'app.common.msgDialog',
    'app.common.menuBar',
    'app.common.dimage',
    'app.common.CommonService',
    "app.unAuthentication",
    "app.authentication",
    "angularFileUpload",
    "vcRecaptcha"

]);

app
    .config(function($httpProvider, $stateProvider, $urlRouterProvider, RestangularProvider, toastrConfig) {
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
        $httpProvider.interceptors.push(function($q, $location, $cookies,$rootScope) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    config.headers.systemtype="WEB";
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
                },

                'response':function(response){
                    if(response.status===202)
                    {
                        //$cookies.put('token',response.headers().newtoken);
                        // $.ajax({
                        //     url: a_cross_domain_url,
                        //     xhrFields: {
                        //         withCredentials: true
                        //     },

                        // });

                        $.ajax({
                            type: "POST",
                            xhrFields: {
                                withCredentials: true
                            },
                            headers:{
                                Authorization:'Bearer '+$cookies.get('token'),
                                systemtype:'WEB'
                            },
                            url: o.const.authBaseUrl+'/api/refresh-token/GetNewToken',
                            data: {refreshCode:$rootScope.refreshCode},
                            success: function(data){
                                //STANDARD
                                /*if(data && data.status=='hasToken')
                                {
                                    $cookies.put("token", data.token);
                                    $rootScope.refreshCode=data.refreshCode;
                                }
                                else
                                {
                                    alert(JSON.stringify(data));
                                }*/
                                if(data)
                                {
                                    if(data.refreshCode!=$rootScope.refreshCode)
                                    {
                                        $cookies.put("token", data.token);
                                        $rootScope.refreshCode=data.refreshCode;
                                    }
                                }
                            },
                        });
                    }
                    return response;
                },
            };
        });
        // END JWT SIGN
        // CORS PROXY
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // END CORS PROXY
        //RESTANGULAR DEFAULT
    	//CONFIG Access-Control-Allow-Credentials=TRUE
    	//Mục đích: request có thể send cookies để authentication với passport
        RestangularProvider.setBaseUrl(o.const.restBaseUrl);
        RestangularProvider.setDefaultHttpFields({
            'withCredentials': true
        });
        // RestangularProvider.setBaseUrl("http://telehealthvietnam.com.vn:3005");
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
    .factory('settings', ['$rootScope', function($rootScope) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: './theme/assets',
            globalPath: './theme/assets/global',
            layoutPath: './theme/assets/layouts/layout',
            pagesPath  : './theme/assets/pages',
        };

        $rootScope.settings = settings;

        return settings;
    }])
    //SETTING RESTANGULAR WITH FULL RESPONSE FOR FILES SYSTEM (data, status, headers, config)
    .factory('FileRestangular',function(Restangular){
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
            RestangularConfigurer.setBaseUrl(o.const.fileBaseUrl);
        });
    })
    //SETTING RESTANGULAR FOR AUTHENTICATION
    .factory('AuthRestangular',function(Restangular){
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(o.const.authBaseUrl);
        });
    })
    .run(function($rootScope, $cookies, $window, $state, Restangular, toastr, settings) {
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
        // END RESTANGULAR ERROR HANDLING --------------------

        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view

        $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
            if (!$cookies.get("userInfo")) {
                if (toState.name !== "unAuthentication.login" && toState.name !== "unAuthentication.register" && toState.name !== "unAuthentication.activation") {
                    e.preventDefault();
                    $state.go("unAuthentication.login", null, {
                        location: "replace",
                        reload: true
                    });
                }
            } else if($cookies.get("userInfo") && $cookies.get("userInfo").Activated == 'Y'){
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
            App.initAjax();
            FormWizard.init(); // form step
            ComponentsDateTimePickers.init(); // init todo page

            ComponentsSelect2.init(); // init todo page
            ComponentsBootstrapSelect.init(); // init todo page
        });
        $rootScope.$on('$includeContentLoaded', function() {
            App.initAjax();
            FormWizard.init(); // form step
            ComponentsDateTimePickers.init(); // init todo page
        });
    })
    