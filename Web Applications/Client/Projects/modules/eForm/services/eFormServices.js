angular.module("app.authentication.eForm.services", [])
    .factory("EFormService", function(Restangular, AuthRestangular) {
            var services = {};
            var api = Restangular.all("api");
            var authApi = AuthRestangular.all("api");

            services.PostListEFormTemplate = function(data){
                    return api.all("eform/template/list").post({
                            data: data
                    });
            };
            services.MakeExternalSecret = function (data) {
                    return authApi.all('external-token/MakeExternalSecret').post(data, null, {'externalname': 'EFORM'});
            };

            services.GetNewExternalToken = function (data) {
                    return authApi.all('external-token/GetNewExternalToken').post(data, null, {'externalname': 'EFORM'});
            }
            return services;
    })
