angular.module('app.unAuthentication.service', [])
.factory("UnauthenticatedService", function(Restangular) {
    var services = {};
    var api = Restangular.all("api");
    services.login = function(options) {
        return api.all('login').post(options);
    }
    services.checkPhoneUserAccount = function(data) {
        var instanceApi = api.all('checkphoneUserAccount');
        return instanceApi.post({data: data});
    }
    services.createAccount = function(data) {
         var instanceApi = api.all('createAccount');
        return instanceApi.post({data: data});
    }
    services.checkUserNameAccount = function(data) {
         var instanceApi = api.all('checkuserNameAccount');
        return instanceApi.post({data: data});
    }
    services.checkEmailAccount = function(data) {
         var instanceApi = api.all('checkemailAccount');
        return instanceApi.post({data: data});
    }
    services.listCountry = function() {
         var instanceApi = api.one('listCountry');
        return instanceApi.get();
    }
    services.sendSms = function(data) {
         var instanceApi = api.all('sendsms');
        return instanceApi.post({data: data});
    }
    services.confirmActivate = function(data) {
         var instanceApi = api.all('confirmActivated');
        return instanceApi.post({data: data});
    }
    services.createCoded = function(data) {
         var instanceApi = api.all('createCode');
        return instanceApi.post({data: data});
    }
    
    return services;
})