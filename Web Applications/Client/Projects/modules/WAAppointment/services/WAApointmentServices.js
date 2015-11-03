angular.module("app.authentication.WAAppointment.services",[])
	.factory("WAAppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");
		services.RequestWAApointment = function(requestInfo){
			return api.all('appointment-wa-request').post({data:requestInfo});
		}
		//load list WAappointment
		services.loadListWAAppointment = function(data){
			return api.all("appointment-wa-list").post({data:data});
		};
		return services;
	});