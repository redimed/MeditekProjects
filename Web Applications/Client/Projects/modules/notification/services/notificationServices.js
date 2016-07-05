var app = angular.module('app.authentication.notification.service', []);

app.factory('notificationServices', function(NcRestangular) {
	var services = {};
    var ncApi = NcRestangular.all("api");
    services.getListNotify = function(data) {
        return ncApi.all("queue/loadlistqueue").post({
            data: data
        });
    };
    return services;
});