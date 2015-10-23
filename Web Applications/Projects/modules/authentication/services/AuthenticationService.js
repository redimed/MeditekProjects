angular.module('app.authentication.service', [])
.factory("AuthenticationService", function(Restangular) {
    var services = {};
    var api = Restangular.all("api");
    services.logout = function(options) {
        return api.one('logout').get();
    };

    services.getListCountry = function() {
    	return api.one('/patient/get-listcountry').get();
    }
    return services;
})