angular.module("app.authentication.eForm.services", [])
    .factory("EFormService", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");

        services.PostListEFormTemplate = function(data){
                return api.all("eform/template/list").post({
                        data: data
                });
        }
        return services;
});