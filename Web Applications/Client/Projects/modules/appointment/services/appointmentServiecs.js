angular.module("app.loggedIn.appointment.services",[])
	.factory("AppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");

		services.getList = function(){
			return api.one('users').get();
		}
		return services;
	})