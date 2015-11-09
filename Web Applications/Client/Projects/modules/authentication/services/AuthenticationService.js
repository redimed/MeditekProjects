angular.module('app.authentication.service', [])
.factory("AuthenticationService", function(Restangular) {
    var services = {};
    var api = Restangular.all("api");
    services.logout = function(options) {
        return api.one('logout').get();
    };

    services.getListCountry = function() {
    	return api.one('/patient/get-listcountry').get();
    };

    services.getDetailUser = function(data) {
    	var getDetailUser = api.all("user-account/get-DetailUser");
		return getDetailUser.post({data:data});
    }

    return services;
})