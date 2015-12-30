angular.module("app.authentication.consultation.services", [])
    .factory("consultationServices", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");
        services.listConsultation = function(data) {
            return api.all('consultation/list').post({data:data});
        }
        return services;
    });
