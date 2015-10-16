angular.module("app.authentication.appointment.services",[])
	.factory("AppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");

		//load list appointment
		services.loadListAppointment = function(data){
			var loadListAppointment = api.all("appointment-telehealth-list");
			return loadListAppointment.post({data:data});
		};
		//Get Detail Appointment
		services.getDetailApppointment = function(data){
			return api.one('appointment-telehealth-detail/'+ data).get();
		};
		services.ListAppointment = function(){
			return api.one('appointment-telehealth-list').get();
		}
		services.SendRequest = function(){
			return api.all('appointment-telehealth-request').post();
		}
		return services;
	})