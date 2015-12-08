angular.module('app.unAuthentication.service', [])
.factory("UnauthenticatedService", function(Restangular,AuthRestangular) {
    var services = {};
    var api = Restangular.all("api");
    var authApi = AuthRestangular.all("api");
    services.login = function(options) {
        return authApi.all('login').post(options);
    },
    services.checkPhoneUserAccount = function(data) {
        var instanceApi = api.all('checkphoneUserAccount');
        return instanceApi.post({data: data});
    },
    services.createAccount = function(data) {
         var instanceApi = api.all('createAccount');
        return instanceApi.post({data: data});
    },
    services.checkUserNameAccount = function(data) {
         var instanceApi = api.all('checkuserNameAccount');
        return instanceApi.post({data: data});
    },
    services.checkEmailAccount = function(data) {
         var instanceApi = api.all('checkemailAccount');
        return instanceApi.post({data: data});
    },
    services.listCountry = function() {
         var instanceApi = api.one('listCountry');
        return instanceApi.get();
    },
    services.sendSms = function(data) {
         var instanceApi = api.all('sendsms');
        return instanceApi.post({data: data});
    },
    services.ConfirmActivated = function(data) {
         var instanceApi = api.all('confirmActivated');
        return instanceApi.post({data: data});
    },
    services.createCoded = function(data) {
         var instanceApi = api.all('createCode');
        return instanceApi.post({data: data});
    },
    services.checkUserStep1 = function(data) {
        var instanceApi = api.all('check-user-step1');
        return instanceApi.post({data:data});
    }
    
    return services;
})