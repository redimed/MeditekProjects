angular.module('app.unAuthentication.service', [])
.factory("UnauthenticatedService", function(Restangular) {
    var services = {};
    var api = Restangular.all("api");
    services.login = function(options) {
        return api.all('login').post(options);
    }
    return services;
})