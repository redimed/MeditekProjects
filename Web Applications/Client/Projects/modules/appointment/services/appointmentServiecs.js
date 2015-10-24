angular.module("app.authentication.appointment.services",[])
	.factory("AppointmentService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");

		//load list appointment
		services.loadListAppointment = function(data){
			var loadListAppointment = api.all("appointment-telehealth-list");
			return loadListAppointment.post({data:data});
		};
		//
		services.upDateApppointment = function(data){
			var upDateApppointment = api.all("appointment-telehealth-update");
			return upDateApppointment.post(data);
		};
		//Get Image Appointment
		services.getDetailApppointment = function(data){
			return api.one('appointment-telehealth-detail/'+ data).get();
		};
		//Get Detail Appointment
		services.getImage = function(){
			// return "http://192.168.1.2:3005/api/downloadFile/"
			return "http://testapp.redimed.com.au:3005/api/downloadFile/"
		};
		services.ListAppointment = function(){
			return api.one('appointment-telehealth-list').get();
		};
		services.ListDoctor = function(){
			return api.one('doctorappointment').get();
		};
		services.getDoctorById = function(data){
			return api.all('doctorIdappointment').post({data:data});
		};
		services.SendRequest = function(requestInfo){
			return api.all('appointment-telehealth-request').post({data:requestInfo});
		};
		return services;
	});