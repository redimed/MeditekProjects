angular.module("app.authentication.WAAppointment.services",[])
	.factory("WAAppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");
		return services;
	});