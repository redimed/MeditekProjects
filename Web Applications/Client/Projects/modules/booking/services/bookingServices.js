angular.module("app.authentication.booking.services", [])
    .factory("BookingService", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");

        services.CreateBooking = function(data){
                return api.all("booking/create").post({
                        data: data
                });
        }

        return services;
});