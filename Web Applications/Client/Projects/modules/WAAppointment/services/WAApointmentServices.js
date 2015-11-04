angular.module("app.authentication.WAAppointment.services",[])
	.factory("WAAppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");
		services.RequestWAApointment = function(requestInfo){
			return api.all('appointment-wa-request').post({data:requestInfo});
		}
		return services;
	});