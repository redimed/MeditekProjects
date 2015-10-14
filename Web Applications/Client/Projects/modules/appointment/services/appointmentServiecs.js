angular.module("app.authentication.appointment.services",[])
	.factory("AppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");

		services.ListAppointment = function(){
			return api.one('appointment-telehealth-list').get();
		}
		services.SendRequest = function(){
			return api.all('appointment-telehealth-request').post();
		}
		return services;
	})