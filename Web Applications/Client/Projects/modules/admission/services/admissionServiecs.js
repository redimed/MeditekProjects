angular.module("app.authentication.admission.services", [])
    .factory("AdmissionService", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");

        services.CreateAdmission = function(data) {
            return api.all("admission/create").post({
                data: data
            });
        };

        services.GetDetailAdmission = function(UID) {
            return api.one("admission/detail/" + UID).get();
        };

        services.GetListAdmission = function(data) {
            return api.all("admission/list").post({
                data: data
            });
        };

        services.UpdateAdmission = function(data) {
            return api.all("admission/update").post({
                data: data
            });
        };

        return services;
    });
