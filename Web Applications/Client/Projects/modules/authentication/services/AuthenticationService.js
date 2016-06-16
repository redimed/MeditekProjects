angular.module('app.authentication.service', [])
    .factory("AuthenticationService", function(Restangular, AuthRestangular, TelehealthRestangular) {
        var services = {};
        var api = Restangular.all("api");
        var authApi = AuthRestangular.all("api");
        var apiTelehealth = TelehealthRestangular.all("api");

        services.logout = function(options) {
            return authApi.one('logout').get();
        };

        services.getListCountry = function() {
            return api.one('/patient/get-listcountry').get();
        };

        services.getDetailUser = function(data) {
            var getDetailUser = api.all("user-account/get-DetailUser");
            return getDetailUser.post({
                data: data
            });
        };

        services.getListDoctor = function(data) {
            return api.all("doctor/loadlist-doctor").post({
                data: data
            });
        };

        services.CreateRoomInOpentok = function() {
            return apiTelehealth.one('telehealth/socket/generateSession').get();
        };

        return services;
    })
