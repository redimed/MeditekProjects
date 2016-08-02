angular.module("app.authentication.booking.services", [])
    .factory("BookingService", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");

        services.CreateBooking = function(data){
                return api.all("booking/create").post({
                        data: data
                });
        }

        services.UpdateBooking = function(data){
                return api.all("booking/update").post({
                        data: data
                });
        }

        services.DestroyBooking = function(data){
            return api.one("booking/destroy/"+data.UID).get();
        }

         services.ChangeStatusBooking = function(data){
            return api.all("booking/update/status").post({
                data: data
            });
        }

        services.LoadBooking = function(data){
                return api.all("booking/list").post({
                        data: data
                })
        }

        services.GetDetailBooking = function(data){
                return api.one("booking/detail/"+data.UID).get();
        }

        services.CheckTimeBooking = function(data){
            return api.all("booking/check-time").post({
                data:data
            })
        }

        services.GetDoctorApptBooking = function(data){
            return api.all("booking/get-doctor-has-appt").post({
                data:data
            })
        }

        return services;
});