angular.module("app.blank.services", [])
    .factory("blankServices", function(Restangular, AuthRestangular) {
        var services = {};
        var api = Restangular.all("api");
        var authApi = AuthRestangular.all("api");
        services.login = function(data) {
            return authApi.all('login').post(data);
        }
        services.registerPatient = function(data) {
            return api.all('patient/register-patient').post(data);
        }
        services.checkpatient = function(data) {
            return api.all('patient/check-patient').post({
                data: data
            });
        }
        services.searchPatient = function(data) {
            return api.all('patient/search-patient').post({
                data: data
            });
        }
        services.LoginAcountPin = function(data) {
            return api.all('login').post({
                data: data
            });
        }
        services.PatientRequestAppointment = function(data) {
           return api.all('appointment-wa-request/patient').post({
                    data: data
                });
        }
        return services;
    });
