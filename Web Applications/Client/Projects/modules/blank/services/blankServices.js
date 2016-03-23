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
            var postData = data.slice(0, 1) + data.slice(2);
            console.log(postData);
            return api.one('user-account/CheckExistUser/'+postData.toString()).get();
            // http://localhost:3005/api/user-account/CheckExistUser/?PhoneNumber=0411111111&Email=sad@sdsd.cs
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
